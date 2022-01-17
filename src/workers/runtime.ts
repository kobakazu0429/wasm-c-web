import { run } from "@kobakazu0429/test";
import { WASI } from "@kobakazu0429/wasmer-wasi";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { WasmFs } from "@wasmer/wasmfs";
import * as Asyncify from "asyncify-wasm";
import type { Node } from "memfs/lib/node";

import { get } from "svelte/store";
import type { Test } from "../test";
import { testBuilder } from "../test";
import { settings as _settings } from "../store";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// TODO: openfiles, stdout, stderr, exitcode
export const startWasiTask = async (
  wasmBinary: Uint8Array,
  consolePrintln: (s: string) => void,
  readLine: () => Promise<string>
) => {
  const wasmFs = new WasmFs();

  const stdinRead: Node["read"] = (stdinBuffer, _off, _len, _pos) => {
    const i = stdinBuffer.findIndex((x) => x === 0);
    return i >= 0 ? i : 0;
  };

  const stdoutWrite: Node["write"] = (buf, _off, len, _pos) => {
    const string = decoder.decode(buf);
    console.log(string);
    consolePrintln(string);
    return len!;
  };

  wasmFs.volume.fds[0]!.node.read = stdinRead;
  wasmFs.volume.fds[1]!.node.write = stdoutWrite;

  const settings = get(_settings);
  const args = settings.argvs.map((a) => a.value);
  const env = Object.fromEntries(settings.env.map((e) => [e.key, e.value]));

  const wasi = new WASI({
    args,
    env,
    bindings: {
      ...WASI.defaultBindings,
      fs: wasmFs.fs,
    },

    stdin: {
      read: async () => {
        let input = await readLine();
        if (!input.endsWith("\n")) input += "\n";
        const buffer = encoder.encode(input);
        return buffer;
      },
    },
  });

  const lowered_wasm = await lowerI64Imports(wasmBinary);
  const module = await WebAssembly.compile(lowered_wasm);
  const instance = await Asyncify.instantiate(module, {
    ...wasi.getImports(module),
  });

  wasi.start(instance);

  const stdout = await wasmFs.getStdOut();
  console.log(stdout);

  // @ts-ignore
  const memoryBuffer = instance.exports.memory.buffer;
  console.log(memoryBuffer);
};

export type StartWasiTask = Parameters<typeof startWasiTask>;

export const testWasi = async (wasmBinary: Uint8Array, tests: Test[]) => {
  const wasmFs = new WasmFs();
  const wasi = new WASI({
    bindings: {
      ...WASI.defaultBindings,
      fs: wasmFs.fs,
    },
  });

  const lowered_wasm = await lowerI64Imports(wasmBinary);
  const module = await WebAssembly.compile(lowered_wasm);
  const instance = await Asyncify.instantiate(module, {
    ...wasi.getImports(module),
  });

  // @ts-expect-error
  const memoryBuffer = instance.exports.memory.buffer;
  console.log(tests);
  console.log(memoryBuffer);

  testBuilder(tests, instance.exports as any, memoryBuffer)();
  const result = await run();
  console.log(result);

  return result;
};

// ref: https://o296.com/2018/06/02/Assemb.html
type Pointer = number;
export class Memory {
  private static offset = 0;

  static registerString(buf: Buffer, str: string): Pointer {
    const pointer = this.offset;
    const { length } = str;

    // structure: str.length, ..., str, ...
    // set str.length
    new Uint32Array(buf, this.offset, 1).set([length]);
    this.offset += 4;

    // set str
    new Uint8Array(buf, this.offset, length).set(encoder.encode(str));
    this.offset += length + (8 - (length % 8));

    return pointer + 4;
  }

  static registerChar(buf: Buffer, value: string | number): Pointer {
    const pointer = this.offset;
    new Int8Array(buf, this.offset, 1).set(
      typeof value === "number" ? [value] : encoder.encode(value)
    );
    this.offset += 1;
    return pointer;
  }

  static readStringFromPointer(buf: Buffer, pointer: Pointer) {
    const view = new DataView(buf);
    const stringLength = view.getUint32(pointer - 4, true);
    console.log(stringLength);
    const array = new Uint8Array(view.buffer, pointer, stringLength);
    console.log(array);

    return decoder.decode(array);
  }
}
