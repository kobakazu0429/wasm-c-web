import { get } from "svelte/store";
import { ulid } from "ulid";
import { decompressLzString } from "../compression";
import { editor, lz as lzStore, monacoEditorCode } from "../store";
import { redToast } from "../toast";
import { clearCode, getPreviousCode } from "./../localStorage/index";
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
  // call function order is important !
  // DO NOT Change or Consider
  resetUrl();
  setCode("");
  lzStore.set("");
  clearCode();
};

export const formatCode = async () => {
  const e = get(editor);
  await e?.getAction("editor.action.formatDocument").run();
};

const createFilename = () => {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const f = String(now.getMilliseconds()).padStart(3, "0");
  return yyyy + MM + dd + "_" + HH + mm + ss + f;
};

export const downloadCode = () => {
  const { code } = getCode();
  if (!code) redToast("code is nothing ?");

  const blob = new Blob([code!], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  const filename = createFilename();
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
  const code = previousCode?.code ?? "";
  const filename = previousCode?.filename ?? `${ulid()}.c`;
  const tests = previousCode?.tests;
  return { code, filename, tests };
};

export const escapeCode = (rawCode: string) => {
  return rawCode.replaceAll("\n", "\r\n");
};
