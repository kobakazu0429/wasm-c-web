import { derived, writable } from "svelte/store";
import type { TestForModal } from "./../jest";

export const buildingTests = writable(new Map<string, TestForModal>());

export const buildingTestsToArray = derived(buildingTests, ($buildingTests) => {
  return Array.from($buildingTests.values());
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

const defaultModalValues: TestForModal = {
  id: "",
  testName: "",
  functionName: "",
  argumentsValue: "",
  returnValue: "",
  returnPrecision: "0",
};

export const currentModal = writable<TestForModal>({
  ...defaultModalValues,
});

export const resetCurrentModal = () => {
  currentModal.set({ ...defaultModalValues });
};
