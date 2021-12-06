import { test, expect } from "@kobakazu0429/test";

export interface Test {
  name: string;
  functionName: string;
  input: any[];
  expect: any;
}

export const testBuilder = (
  tests: Test[],
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
