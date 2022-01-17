import { run, constructResultsHTML } from "@kobakazu0429/test";
import { testBuilder } from "./index";
import type { Test } from "./index";

const tests: Test[] = [
  {
    id: "1",
    testName: "sum(1, 2) should be 3",
    functionName: "sum",
    argumentsValue: [1, 2],
    returnValue: 3,
    returnPrecision: 0,
  },
  {
    id: "2",
    testName: "div(8, 2) should be 4",
    functionName: "div",
    argumentsValue: [8, 2],
    returnValue: 4,
    returnPrecision: 0,
  },
];

function sum(a: number, b: number) {
  return a + b;
}

function div(a: number, b: number) {
  return a / b;
}

describe("jest", () => {
  test.skip("testBuilder", async () => {
    testBuilder(tests, { sum, div })();
    const result = await run();
    expect(constructResultsHTML(result)).toMatchInlineSnapshot();
  });
});
