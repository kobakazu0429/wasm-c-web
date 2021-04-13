import { isTestFixture, testBuilder } from "./index";
import type { Test, TestFixture } from "./index";

const test: Test = {
  name: "sum(1, 2) should be 3",
  functionName: "sum",
  input: [1, 2],
  expect: 3,
};

const testFixture: TestFixture = {
  title: "function",
  tests: [
    {
      title: "sum",
      tests: [
        {
          name: "sum(1, 2) should be 3",
          functionName: "sum",
          input: [1, 2],
          expect: 3,
        },
      ],
    },
    {
      title: "div",
      tests: [
        {
          name: "div(8, 2) should be 4",
          functionName: "div",
          input: [8, 2],
          expect: 4,
        },
        {
          name: "div(10, 3) should be 3.3333",
          functionName: "div",
          input: [10, 3],
          expect: 3.3333,
        },
      ],
    },
  ],
};

function sum(a: number, b: number) {
  return a + b;
}

function div(a: number, b: number) {
  return a / b;
}

// inject jest
// @ts-ignore
window.jestLite = {
  core: { describe, it, expect },
};

describe("jest", () => {
  describe("isTestFixture", () => {
    it("pass Test should be false", () => {
      expect(isTestFixture(test)).toBeFalsy();
    });

    it("pass TestFixture should be true", () => {
      expect(isTestFixture(testFixture)).toBeTruthy();
    });
  });

  describe("testBuilder", () => {
    testBuilder(
      {
        title: "test builder with test",
        tests: [test],
      },
      { sum }
    )();

    testBuilder(testFixture, { sum, div })();
  });
});
