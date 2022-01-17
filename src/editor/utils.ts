import { get } from "svelte/store";
import { ulid } from "ulid";
import { decompressLzString } from "../compression";
import { editor, lz as lzStore, monacoEditorCode } from "../store";
import { redToast } from "../toast";
import { clearCode, getPreviousCode } from "./../localStorage/index";
import { stdin as exampleCode } from "../editor/exampleCodes";
import { resetUrl } from "../url";
import type { Test } from "../test";

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
  lzStore.set("");
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
  tests?: Test[];
}
export const recoveryCode = (): RecoveryCode => {
  const lz = get(lzStore);
  if (lz) {
    const decompressedLz = decompressLzString(lz);
    if (decompressedLz !== "") {
      const recovered = JSON.parse(decompressedLz) as Partial<RecoveryCode>;
      recovered.code = recovered.code
        ? recovered.code.replaceAll(/\r(\r)+/g, "\r")
        : "";
      recovered.filename ??= `${ulid()}.c`;
      return recovered as RecoveryCode;
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
