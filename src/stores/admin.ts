import { derived, writable } from "svelte/store";
import { mainTestSchema, testForModalToTestConverter } from "../test";
import type { TestForModal } from "../test";

export const buildingTests = writable(new Map<string, TestForModal>());

export const displayBuildingTestsTable = derived(buildingTests, ($buildingTests) => {
  return Array.from($buildingTests.values()).map((t) => {
    if (t.type === "function") {
      const argumentsValues = t.argumentsValues.map((arg) => arg.value).join(", ");
      const returnValue = `(${t.returnValue.type}) ${t.returnValue.value}`;
      return { ...t, returnValue, argumentsValues };
    } else if (t.type === "main") {
      const stripped = mainTestSchema.strip().parse(testForModalToTestConverter(t));
      stripped.stdin = stripped.stdin.map((s) => s.replaceAll("\n", "\\n"));
      stripped.stdout = stripped.stdout.replaceAll("\n", "\\n");
      return stripped;
    }

    throw new Error("Invalid test type");
  });
});

export const buildingTestsAllDelete = () => {
  buildingTests.update((self) => {
    self.clear();
    return self;
  });
};

export const buildingTestsDeleter = (id: string) => {
  buildingTests.update((self) => {
    self.delete(id);
    return self;
  });
};

export const buildingTestsAdder = (test: TestForModal) => {
  buildingTests.update((self) => {
    self.set(test.id, test);
    return self;
  });
};

export const argumentsValueAdder = () => {
  currentModal.update((self) => {
    if (self.type === "function") {
      self.argumentsValues.push({ type: "void", value: "" });
    }
    return self;
  });
};

export const argumentsValueDeleter = (index: number) => {
  currentModal.update((self) => {
    if (self.type === "function") {
      self.argumentsValues.splice(index, 1);
    }
    return self;
  });
};

export const currentModal = writable<TestForModal>({
  type: "function",
  id: "",
  testName: "",
  functionName: "",
  argumentsValues: [],
  returnValue: {
    type: "void",
    value: ""
  },
  returnPrecision: "0"
});

export const resetCurrentModalTypeFunction = () => {
  currentModal.set({
    type: "function",
    id: "",
    testName: "",
    functionName: "",
    argumentsValues: [],
    returnValue: {
      type: "void",
      value: ""
    },
    returnPrecision: "0"
  });
};

export const resetCurrentModalTypeMain = () => {
  currentModal.set({
    type: "main",
    id: "",
    testName: "",
    functionName: "main",
    stdin: "",
    stdout: ""
  });
};
