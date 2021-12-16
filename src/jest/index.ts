import { z } from "zod";
import { test, expect } from "@kobakazu0429/test";

export const testsSchema = z
  .object({
    name: z.string().nonempty(),
    functionName: z.string().nonempty(),
    input: z.union([z.number().array().nonempty(), z.null().array()]),
    expect: z.union([z.number(), z.null()]),
  })
  .strict()
  .array();

export type Tests = z.infer<typeof testsSchema>;

export const testBuilder = (
  tests: Tests,
  functions: Record<string, CallableFunction>
) => {
  return () => {
    tests.forEach((t) => {
      test(t.name, async () => {
        const myfunction = functions[t.functionName];

        if (!myfunction)
          throw new Error(
            "Unable function name or Not found. Check your code or test cases."
          );

        // TODO: add filed `float, double as type` to Test
        const value = await myfunction(...t.input);
        expect(value).toBeCloseTo(t.expect, 4);
      });
    });
  };
};
