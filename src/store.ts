import { writable } from "svelte/store";

export const monacoEditorCode = writable("");

export const consoleBody = writable([] as string[]);
export const consoleOut = (s: string) => {
  consoleBody.update((p) => [...p, s]);
};

export const testResultBody = writable("");
export const testResultOut = (s: string) => {
  testResultBody.set(s);
};
