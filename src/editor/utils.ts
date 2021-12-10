import { get } from "svelte/store";
import { editor, monacoEditorCode } from "../store";
import { redToast } from "../toast";
import { clearCode } from "./../localStorage/index";

export const getCode = () => {
  const e = get(editor);
  const filename = e?.getModel()?.uri.path.split("/")[1];
  const value = e?.getValue();
  return { filename, value };
};

export const setCode = (code: string) => {
  monacoEditorCode.set(code);
  get(editor)?.getModel()?.setValue(code);
};

export const newFile = () => {
  clearCode();
  setCode("");
};

export const formatCode = async () => {
  const e = get(editor);
  await e?.getAction("editor.action.formatDocument").run();
};

export const downloadCode = () => {
  const { value } = getCode();
  if (!value) redToast("value is nothing ?");

  const blob = new Blob([value!], { type: "text/plain" });
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
