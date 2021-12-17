import { derived, writable } from "svelte/store";
import type { Row } from "../components/Admin/TestsBuildTable/table";

export const buildingTests = writable(new Map<string, Row>());

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

export const buildingTestsAdder = (row: Row) => {
  buildingTests.update((self) => {
    self.set(row.id, row);
    return self;
  });
};

const defaultModalValues = {
  testName: "",
  functionName: "",
  argumentsValue: "",
  returnValue: "",
  returnPrecision: 0,
};

export const currentModal = writable<Omit<Row, "id">>({
  ...defaultModalValues,
});

export const resetCurrentModal = () => {
  currentModal.set({ ...defaultModalValues });
};
