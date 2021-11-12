import type { editor as Editor } from "monaco-editor";
import { writable } from "svelte/store";
import type { Argvs, Config, Env } from "./components/SettingModal/type";

export const monacoEditorCode = writable("");

type Settings = { config: Config; env: Env; argvs: Argvs };
export const settings = writable<Settings>({
  config: [
    { key: "timeout [ms]", value: "3000" },
    { key: "use File System", value: false },
  ],

  env: [
    { key: "LANG", value: "ja_JP.UTF-8" },
    { key: "HOME", value: "/home/user" },
    { key: "USER", value: "user" },
  ],

  argvs: [{ value: "./main", fixed: true }],
});

export const settingsRemover = (key: keyof Settings, i: number) => {
  settings.update((self) => {
    self[key].splice(i, 1);
    return self;
  });
};

export const settingsAdder = (key: keyof Settings) => {
  settings.update((self) => {
    switch (key) {
      case "argvs":
        self[key].push({ value: "", fixed: false });
        break;
      case "env":
      case "config":
        self[key].push({ key: "", value: "" });
        break;

      default:
        break;
    }
    return self;
  });
};

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
export const compileLog = writable("");
export const compileLogOut = (s: string) => {
  const time = new Date();
  const hh = padding(time.getHours(), 2);
  const mm = padding(time.getMinutes(), 2);
  const ss = padding(time.getSeconds(), 2);
  const ms = padding(time.getMilliseconds(), 3);

  const displayTime = `[${hh}:${mm}:${ss}.${ms}] `;
  compileLog.set(displayTime + s);
};

export const editor = writable<Editor.IStandaloneCodeEditor | null>(null);
export const editorRef = writable<HTMLDivElement | null>(null);
export const editorPreviousSize = writable<{
  height: number;
  width: number;
} | null>(null);
