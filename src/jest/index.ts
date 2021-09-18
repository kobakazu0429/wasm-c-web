export const {
  core: { describe, it, expect, run },
  prettify,
  // @ts-ignore
} = window.jestLite;

export interface Test {
  name: string;
  functionName: string;
  input: any[];
  expect: any;
}

export interface TestFixture {
  title: string;
  tests: Test[] | TestFixture[];
}

export function isTestFixture(test: Test | TestFixture): test is TestFixture {
  if ("title" in test) return true;
  return false;
}

export const testBuilder = (
  testFixture: TestFixture,
  functions: Record<string, CallableFunction>
) => {
  const { title, tests } = testFixture;

  return () => {
    // @ts-ignore
    window.jestLite.core.describe(title, () => {
      tests.forEach((test: TestFixture["tests"][number]) => {
        if (isTestFixture(test)) {
          testBuilder(test, functions)();
        } else {
          // @ts-ignore
          window.jestLite.core.it(test.name, async () => {
            const myfunction = functions[test.functionName];

            if (!myfunction)
              throw new Error(
                "Unable function name or Not found. Check your code or test cases."
              );

            // TODO: add filed `float, double as type` to Test
            // @ts-ignore
            window.jestLite.core
              .expect(await myfunction(...test.input))
              .toBeCloseTo(test.expect, 4);
          });
        }
      });
    });
  };
};
