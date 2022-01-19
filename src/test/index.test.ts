import { run, constructResultsHTML } from "@kobakazu0429/test";
// import { testBuilder } from "./index";
import type { Test } from "./index";

const tests: Test[] = [
  {
    id: "1",
    testName: "add(1, 2) should be 3",
    functionName: "add",
    argumentsValues: [
      { type: "int", value: 1 },
      { type: "int", value: 2 },
    ],
    returnValue: { type: "int", value: 3 },
    returnPrecision: 0,
  },
  {
    id: "2",
    testName: "div(8, 2) should be 4",
    functionName: "div",
    argumentsValues: [
      { type: "int", value: 8 },
      { type: "int", value: 2 },
    ],
    returnValue: { type: "int", value: 4 },
    returnPrecision: 0,
  },
];

// function add(a: number, b: number) {
//   return a + b;
// }

// function div(a: number, b: number) {
//   return a / b;
// }

describe("jest", () => {
  test.skip("testBuilder", async () => {
    // testBuilder(tests, { add, div })();
    const result = await run();
    expect(constructResultsHTML(result)).toMatchInlineSnapshot();
  });
});
