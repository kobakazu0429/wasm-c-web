import { get } from "svelte/store";
import { compiler } from "../compiler";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  compileLogOut,
  monacoEditorCode,
} from "../store";

export const compile = async () => {
  const rawCode = get(monacoEditorCode);

  accordionOpen.update((p) => ({ ...p, compileLog: true }));

  const res = await compiler(rawCode);
  if (res.code === 0) {
    compiledCode.set(rawCode);
    compiledData.set(Uint8Array.from((res.binary as any).data));
  } else {
    compileLogOut(res.message);
  }
  return res.code;
};
