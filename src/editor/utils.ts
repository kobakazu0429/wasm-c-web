import { get } from "svelte/store";
import { editor } from "../store";

export const getCode = () => {
  const e = get(editor);
  const filename = e?.getModel()?.uri.path.split("/")[1];
  const value = e?.getValue();
  return { filename, value };
};
