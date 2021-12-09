import { get } from "svelte/store";
import { editor, monacoEditorCode } from "../store";
import { clearCode } from "./../localStorage/index";

export const getCode = () => {
  const e = get(editor);
  const filename = e?.getModel()?.uri.path.split("/")[1];
  const value = e?.getValue();
  return { filename, value };
};

export const newFile = () => {
  clearCode();
  monacoEditorCode.set("");
  get(editor)?.getModel()?.setValue("");
};

export const formatCode = async () => {
  const e = get(editor);
  await e?.getAction("editor.action.formatDocument").run();
};
