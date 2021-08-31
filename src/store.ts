import { writable } from "svelte/store";

export const monacoEditorCode = writable("");

export const consoleOut = writable("");
export const consolePrintln = (s: string) => {
  consoleOut.set(s);
};

export const isInputMode = writable(false);
export const setInputMode = (mode: boolean) => isInputMode.set(mode);

export const testResultBody = writable("");
export const testResultOut = (s: string) => {
  testResultBody.set(s);
};

const padding = (n: number, length: number) => {
  return String(n).padStart(length, "0");
};
export const compileLogBody = writable([] as string[]);
export const compileLogOut = (s: string) => {
  const time = new Date();
  const hh = padding(time.getHours(), 2);
  const mm = padding(time.getMinutes(), 2);
  const ss = padding(time.getSeconds(), 2);
  const ms = padding(time.getMilliseconds(), 3);

  const displayTime = `[${hh}:${mm}:${ss}.${ms}] `;
  compileLogBody.update((p) => [...p, displayTime + s]);
};
