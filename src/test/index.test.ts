import { describe, test, expect } from "vitest";
import { run, constructResultsHTML } from "@kobakazu0429/test";
import { testBuilder } from "./index";
import type { Test } from "./index";

const tests: Test[] = [
  {
    id: "1",
    testName: "add(1, 2) should be 3",
    functionName: "add",
    argumentsValues: [
      { type: "int", value: 1 },
      { type: "int", value: 2 }
    ],
    returnValue: { type: "int", value: 3 },
    returnPrecision: 0
  },
  {
    id: "2",
    testName: "div(8, 2) should be 4",
    functionName: "div",
    argumentsValues: [
      { type: "int", value: 8 },
      { type: "int", value: 2 }
    ],
    returnValue: { type: "int", value: 4 },
    returnPrecision: 0
  }
];

function add(a: number, b: number) {
  return a + b;
}

function div(a: number, b: number) {
  return a / b;
}

describe("jest", () => {
  describe("testBuilder", () => {
    const timeRegExp = /\s*Time: \d+.\d+ \[s\]\s*/g;
    test.skip("PASS", async () => {
      testBuilder(tests, { add, div }, new ArrayBuffer(0))();
      const result = await run();
      const html = constructResultsHTML(result).trim().replace(timeRegExp, "");
      expect(html).toMatchInlineSnapshot(`
        "<div class=\\"test-report__result\\">
              <span class=\\"test-report__status-icon\\">✓</span>
              <span class=\\"test-report__status test-report__status--pass\\">
                PASS
              </span>
              add(1, 2) should be 3


            </div>

            <div class=\\"test-report__result\\">
              <span class=\\"test-report__status-icon\\">✓</span>
              <span class=\\"test-report__status test-report__status--pass\\">
                PASS
              </span>
              div(8, 2) should be 4


            </div>


            <span class=\\"test-report__summary-status test-report__summary-status--pass\\">
              Tests: 0 failed, 2 passed, 2 total<br></span>"
      `);
    });

    test("FAIL", async () => {
      testBuilder(
        tests,
        {
          add: function add(a: number, b: number) {
            return a - b;
          },
          div
        },
        new ArrayBuffer(0)
      )();
      const result = await run();
      const html = constructResultsHTML(result).replace(timeRegExp, "");
      expect(html).toMatchInlineSnapshot(`
        "
            
            <div class=\\"test-report__result\\">
              <span class=\\"test-report__status-icon\\">×</span>
              <span class=\\"test-report__status test-report__status--fail\\">
                FAIL
              </span>
              add(1, 2) should be 3
              <div class=\\"test-report__errors\\">expected: 3, received: -1</div>
              
            </div>
          
            <div class=\\"test-report__result\\">
              <span class=\\"test-report__status-icon\\">✓</span>
              <span class=\\"test-report__status test-report__status--pass\\">
                PASS
              </span>
              div(8, 2) should be 4
              
              
            </div>
          
            
            <span class=\\"test-report__summary-status test-report__summary-status--fail\\">
              Tests: 1 failed, 1 passed, 2 total<br></span>
          
          "
      `);
    });
  });
});
