import { z } from "zod";
import { test, expect } from "@kobakazu0429/test";
import { cTypesSchema } from "./cTypes";
import type { CTypesSchema } from "./cTypes";
import { Memory } from "../workers/runtime";

const testSchema = z
  .object({
    id: z.string().nonempty(),
    testName: z.string().nonempty(),
    functionName: z.string().nonempty(),
    argumentsValues: cTypesSchema.array(),
    returnValue: cTypesSchema,
    returnPrecision: z.union([z.number(), z.null()]),
  })
  .strict();

export const testsSchema = testSchema.array();

export type Test = z.infer<typeof testSchema>;

type Type = CTypesSchema["type"];
export type TestForModal = Omit<
  Test,
  "argumentsValues" | "returnValue" | "returnPrecision"
> & {
  argumentsValues: Array<{ type: Type; value: string }>;
  returnValue: {
    type: Type;
    value: string;
  };
  returnPrecision: string;
};

export const testBuilder = (
  tests: Test[],
  functions: Record<string, CallableFunction>,
  memoryBuffer: ArrayBuffer
) => {
  return () => {
    tests.forEach((t) => {
      test(t.testName, async () => {
        const myfunction = functions[t.functionName];

        if (!myfunction)
          throw new Error(
            "Unable function name or Not found. Check your code or test cases."
          );

        const argumentsValues = t.argumentsValues
          .map((s) => {
            if (s.type === "char[]") {
              return Memory.registerString(memoryBuffer, s.value);
            } else if (s.type === "char(number)" || s.type === "char(ascii)") {
              return Memory.registerChar(memoryBuffer, s.value);
            } else {
              return s.value;
            }
          })
          .filter((a) => a !== null);

        const returnValue = await myfunction(...argumentsValues);

        if (t.returnValue.type === "void") {
          return;
        }

        if (t.returnValue.type === "char[]") {
          const value = Memory.readStringFromPointer(memoryBuffer, returnValue);
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
          expect(returnValue).toBeCloseTo(
            t.returnValue.value,
            t.returnPrecision
          );
        }
      });
    });
  };
};

const cTypeConverter = ({
  type,
  value,
}: {
  type: Type;
  value: string;
}): CTypesSchema => {
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
        value: parseInt(value),
      };

    case "char(ascii)":
      return {
        type,
        value,
      };

    case "char[]":
      return { type, value: String(value) };

    case "void":
      return { type, value: null };
  }
};

export const testForModalToTestConverter = (test: TestForModal): Test => {
  const argumentsValues = test.argumentsValues.map(cTypeConverter);

  const convertedTest: Test = {
    ...test,
    argumentsValues,
    returnValue: cTypeConverter(test.returnValue),
    returnPrecision: test.returnPrecision ? Number(test.returnPrecision) : null,
  };
  return convertedTest;
};

export const TestToTestForModalConverter = (test: Test): TestForModal => {
  return {
    ...test,
    argumentsValues: test.argumentsValues.map(({ type, value }) => ({
      type,
      value: String(value),
    })),
    returnValue: {
      type: test.returnValue.type,
      value: String(test.returnValue.value ?? ""),
    },
    returnPrecision: String(test.returnPrecision ?? ""),
  };
};
