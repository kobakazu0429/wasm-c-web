import { z } from "zod";
import { test, expect } from "@kobakazu0429/test";
import { cTypesSchema } from "./cTypes";
import type { CTypesSchema } from "./cTypes";
import { Memory } from "../workers/runtime";
import { WASI } from "@kobakazu0429/wasmer-wasi";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { WasmFs } from "@wasmer/wasmfs";
import * as Asyncify from "asyncify-wasm";
import type { Node } from "memfs/lib/node";

export const functionTestSchema = z
  .object({
    type: z.literal("function"),
    id: z.string().min(1),
    testName: z.string().min(1),
    functionName: z.string().min(1),
    argumentsValues: cTypesSchema.array(),
    returnValue: cTypesSchema,
    returnPrecision: z.union([z.number(), z.null()])
  })
  .strict();
export type FunctionTest = z.infer<typeof functionTestSchema>;

export const mainTestSchema = z
  .object({
    type: z.literal("main"),
    id: z.string().min(1),
    testName: z.string().min(1),
    functionName: z.literal("main"),
    stdin: z.string().array(),
    stdout: z.string()
  })
  .strict();
export type MainTest = z.infer<typeof mainTestSchema>;

const testSchema = z.union([functionTestSchema, mainTestSchema]);
const testSchemaStrip = z.union([functionTestSchema.strip(), mainTestSchema.strip()]);

export const testsSchema = testSchema.array();
export const testsSchemaStrip = testSchemaStrip.array();

export type Test = z.infer<typeof testSchema>;

type Type = CTypesSchema["type"];
export type FunctionTestForModal = Omit<
  FunctionTest,
  "argumentsValues" | "returnValue" | "returnPrecision"
> & {
  argumentsValues: Array<{ type: Type; value: string }>;
  returnValue: {
    type: Type;
    value: string;
  };
  returnPrecision: string;
};
export type MainTestForModal = Omit<MainTest, "stdin"> & {
  stdin: string;
};
export type TestForModal = FunctionTestForModal | MainTestForModal;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const testBuilder = async (wasmBinary: Uint8Array, tests: Test[]) => {
  tests.forEach((t) => {
    test(t.testName, async () => {
      const wasmFs = new WasmFs();

      const stdinIterator = t.type === "main" ? t.stdin[Symbol.iterator]() : null;
      const stdinRead: Node["read"] = (stdinBuffer, _off, _len, _pos) => {
        // console.log("called: wasmFs.volume.fds[0].node.read (stdinRead)");
        const i = stdinBuffer.findIndex((x) => x === 0);
        return i >= 0 ? i : 0;
      };

      let stdout = "";
      const stdoutWrite: Node["write"] = (buf, _off, len, _pos) => {
        const string = decoder.decode(buf);
        stdout += string;
        return len!;
      };

      wasmFs.volume.fds[0]!.node.read = stdinRead;
      wasmFs.volume.fds[1]!.node.write = stdoutWrite;

      const wasi = new WASI({
        bindings: {
          ...WASI.defaultBindings,
          fs: wasmFs.fs
        },
        stdin:
          t.type === "main"
            ? {
                read: async () => {
                  // console.log("called: wasi.stdin.read");
                  const it = stdinIterator?.next();
                  if (it?.done) {
                    throw new Error("stdin is empty");
                  }
                  let input = it?.value;
                  if (!input?.endsWith("\n")) input += "\n";
                  const buffer = encoder.encode(input);
                  return buffer;
                }
              }
            : undefined
      });

      const lowered_wasm = await lowerI64Imports(wasmBinary);
      const module = await WebAssembly.compile(lowered_wasm);
      const instance = await Asyncify.instantiate(module, {
        ...wasi.getImports(module)
      });

      // from: https://github.com/kobakazu0429/wasmer-js/blob/master/packages/wasi/src/index.ts#L1534
      const exports = instance.exports;
      if (exports === null || typeof exports !== "object") {
        throw new Error(`instance.exports must be an Object. Received ${exports}.`);
      }
      const { memory } = exports;
      if (!(memory instanceof WebAssembly.Memory)) {
        throw new Error(
          `instance.exports.memory must be a WebAssembly.Memory. Recceived ${memory}.`
        );
      }

      console.log({ tests });
      console.log({ instance });

      if (t.type === "main") {
        wasi.setMemory(memory);
        if (exports._start) {
          await (exports as any)._start();
        }
        console.log({ stdout });
        expect(stdout).toBe(t.stdout);
      } else {
        const functions = instance.exports as any;
        const fn = functions[t.functionName];

        if (!fn) {
          throw new Error("Unable function name or Not found. Check your code or test cases.");
        }

        const argumentsValues = t.argumentsValues
          .map((s) => {
            if (s.type === "char[]") {
              return Memory.registerString(memory.buffer, s.value);
            } else if (s.type === "char(number)" || s.type === "char(ascii)") {
              return Memory.registerChar(memory.buffer, s.value);
            } else {
              return s.value;
            }
          })
          .filter((a) => a !== null);

        const returnValue = await fn(...argumentsValues);

        if (t.returnValue.type === "void") {
          return;
        }

        if (t.returnValue.type === "char[]") {
          const value = Memory.readStringFromPointer(memory.buffer, returnValue);
          expect(value).toBe(t.returnValue.value);
        } else if (t.returnValue.type === "char(ascii)") {
          const value = String.fromCharCode(returnValue);
          expect(value).toBe(value);
        } else if (
          t.returnValue.type === "int" ||
          t.returnValue.type === "char(number)" ||
          t.returnValue.type === "unsigned char" ||
          t.returnPrecision === 0
        ) {
          expect(returnValue).toBe(t.returnValue.value);
        } else {
          expect(returnValue).toBeCloseTo(t.returnValue.value, t.returnPrecision);
        }
      }
    });
  });
};

const cTypeConverter = ({ type, value }: { type: Type; value: string }): CTypesSchema => {
  switch (type) {
    case "int":
    case "unsigned char":
      return { type, value: parseInt(value) };

    case "float":
    case "double":
      return { type, value: parseFloat(value) };

    case "char(number)":
      return {
        type,
        value: parseInt(value)
      };

    case "char(ascii)":
      return {
        type,
        value
      };

    case "char[]":
      return { type, value: String(value) };

    case "void":
      return { type, value: null };
  }
};

export const testForModalToTestConverter = (test: TestForModal): Test => {
  if (test.type === "function") {
    const argumentsValues = test.argumentsValues.map(cTypeConverter);

    const convertedTest: Test = {
      ...test,
      argumentsValues,
      returnValue: cTypeConverter(test.returnValue),
      returnPrecision: test.returnPrecision ? Number(test.returnPrecision) : null
    };
    return convertedTest;
  } else {
    const splitedStdin = test.stdin.split("\n");
    const convertedTest: Test = {
      ...test,
      stdin: splitedStdin
    };
    return convertedTest;
  }
};

export const TestToTestForModalConverter = (test: Test): TestForModal => {
  if (test.type === "function") {
    return {
      ...test,
      argumentsValues: test.argumentsValues.map(({ type, value }) => ({
        type,
        value: String(value)
      })),
      returnValue: {
        type: test.returnValue.type,
        value: String(test.returnValue.value ?? "")
      },
      returnPrecision: String(test.returnPrecision ?? "")
    };
  } else {
    const stdin = test.stdin.join("\n");
    return {
      ...test,
      stdin
    };
  }
};
