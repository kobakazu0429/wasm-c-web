import { derived, writable } from "svelte/store";
import type { TestForModal } from "../test";

export const buildingTests = writable(new Map<string, TestForModal>());

export const displayBuildingTestsTable = derived(
  buildingTests,
  ($buildingTests) => {
    return Array.from($buildingTests.values()).map((t) => {
      const argumentsValues = t.argumentsValues
        .map((arg) => arg.value)
        .join(", ");
      const returnValue = `(${t.returnValue.type}) ${t.returnValue.value}`;
      return { ...t, returnValue, argumentsValues };
    });
  }
);

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
    self.argumentsValues.push({ type: "void", value: "" });
    return self;
  });
};

export const argumentsValueDeleter = (index: number) => {
  currentModal.update((self) => {
    self.argumentsValues.splice(index, 1);
    return self;
  });
};

export const currentModal = writable<TestForModal>({
  id: "",
  testName: "",
  functionName: "",
  argumentsValues: [],
  returnValue: {
    type: "void",
    value: "",
  },
  returnPrecision: "0",
});

export const resetCurrentModal = () => {
  currentModal.set({
    id: "",
    testName: "",
    functionName: "",
    argumentsValues: [],
    returnValue: {
      type: "void",
      value: "",
    },
    returnPrecision: "0",
  });
};
