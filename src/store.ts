import { writable } from "svelte/store";

export const monacoEditorCode = writable("");

export const consoleBody = writable([] as string[]);
export const consoleOut = (s: string) => {
  consoleBody.update((p) => [...p, s]);
};
