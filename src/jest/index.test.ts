import { run, constructResultsHTML } from "@kobakazu0429/test";
import { testBuilder } from "./index";
import type { Test } from "./index";

const tests: Test[] = [
  {
    name: "sum(1, 2) should be 3",
    functionName: "sum",
    input: [1, 2],
    expect: 3,
  },
  {
    name: "div(8, 2) should be 4",
    functionName: "div",
    input: [8, 2],
    expect: 4,
  },
];

function sum(a: number, b: number) {
  return a + b;
}

function div(a: number, b: number) {
  return a / b;
}

// inject jest
// @ts-ignore

describe("jest", () => {
  test.skip("testBuilder", async () => {
    testBuilder(tests, { sum, div })();
    const result = await run();
    expect(constructResultsHTML(result)).toMatchInlineSnapshot();
  });
});
