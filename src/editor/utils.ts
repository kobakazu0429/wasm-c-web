import { get } from "svelte/store";
import { ulid } from "ulid";
import { decompressLzString } from "../compression";
import { editor, monacoEditorCode, tests } from "../store";
import { redToast } from "../toast";
import { clearCode, getPreviousCode } from "./../localStorage/index";
import { stdin as exampleCode } from "../editor/exampleCodes";
import { resetUrl } from "../url";
import type { Tests } from "../jest";

export const getCode = () => {
  const e = get(editor);
  const filename = e?.getModel()?.uri.path.split("/")[1];
  const value = e?.getValue();
  return { filename, code: value };
};

export const setCode = (code: string) => {
  monacoEditorCode.set(code);
  get(editor)?.getModel()?.setValue(code);
};

export const newFile = () => {
  clearCode();
  setCode("");
  resetUrl();
  tests.set(null);
};

export const formatCode = async () => {
  const e = get(editor);
  await e?.getAction("editor.action.formatDocument").run();
};

export const downloadCode = () => {
  const { code } = getCode();
  if (!code) redToast("code is nothing ?");

  const blob = new Blob([code!], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  const filename = new Date()
    .toLocaleString()
    .replaceAll(/\/|:/g, "")
    .replaceAll(" ", "_");
  a.download = filename + ".c";
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export interface RecoveryCode {
  code: string;
  filename: string;
  tests?: Tests;
}
export const recoveryCode = (lz: string | null): RecoveryCode => {
  if (lz) {
    const decompressedLz = decompressLzString(lz);
    if (decompressedLz !== "") {
      return JSON.parse(decompressedLz) as RecoveryCode;
    }
  }
  const previousCode = getPreviousCode();
  const code = previousCode?.code ?? exampleCode;
  const filename = previousCode?.filename ?? `${ulid()}.c`;
  return { code, filename };
};

export const escapeCode = (rawCode: string) => {
  return rawCode.replaceAll("\n", "\r\n");
};
