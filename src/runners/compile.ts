import { get } from "svelte/store";
import { compiler } from "../compiler";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  compileLogOut,
  monacoEditorCode,
} from "../store";
import { normalToast, greenToast, redToast } from "./../toast/index";

export const compile = async () => {
  normalToast("[compile] start");
  const rawCode = get(monacoEditorCode);

  accordionOpen.update((p) => ({ ...p, compileLog: true }));

  const res = await compiler(rawCode);
  if (res.code === 0) {
    compiledCode.set(rawCode);
    compiledData.set(Uint8Array.from((res.binary as any).data));
    greenToast("[compile] succeeded");
  } else {
    compileLogOut(res.message);
    redToast("[compile] failed");
  }
  return res.code;
};
