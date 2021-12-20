import { z } from "zod";
import { test, expect } from "@kobakazu0429/test";

const testSchema = z
  .object({
    id: z.string().nonempty(),
    testName: z.string().nonempty(),
    functionName: z.string().nonempty(),
    argumentsValue: z.union([z.number().array().nonempty(), z.null().array()]),
    returnValue: z.union([z.number(), z.null()]),
    returnPrecision: z.union([z.number(), z.null()]),
  })
  .strict();

export const testsSchema = testSchema.array();

export type Test = z.infer<typeof testSchema>;

export type TestForModal = Omit<
  Test,
  "argumentsValue" | "returnValue" | "returnPrecision"
> & {
  argumentsValue: string;
  returnValue: string;
  returnPrecision: string;
};

export const testBuilder = (
  tests: Test[],
  functions: Record<string, CallableFunction>
) => {
  return () => {
    tests.forEach((t) => {
      test(t.testName, async () => {
        const myfunction = functions[t.functionName];

        if (!myfunction)
          throw new Error(
            "Unable function name or Not found. Check your code or test cases."
          );

        // TODO: add filed `float, double as type` to Test
        const value = await myfunction(...t.argumentsValue);
        if (t.returnPrecision && t.returnPrecision === 0) {
          expect(value).toBe(t.returnValue);
        } else {
          expect(value).toBeCloseTo(t.returnValue, t.returnPrecision);
        }
      });
    });
  };
};
