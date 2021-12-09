import { get } from "svelte/store";
import { compiler } from "../compiler";
import {
  compiledCode,
  compiledData,
  compileLogOut,
  monacoEditorCode,
} from "../store";

export const compile = async () => {
  const rawCode = get(monacoEditorCode);

  const res = await compiler(rawCode);
  if (res.code === 0) {
    compiledCode.set(rawCode);
    compiledData.set(Uint8Array.from((res.binary as any).data));
  } else {
    compileLogOut(res.message);
  }
  return res.code;
};
