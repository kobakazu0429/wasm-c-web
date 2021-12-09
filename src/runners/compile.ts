import { get } from "svelte/store";
import { compiler } from "../compiler";
import { _ } from "../i18n";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  compileLogOut,
  monacoEditorCode,
} from "../store";
import { normalToast, greenToast, redToast } from "./../toast/index";

export const compile = async () => {
  normalToast(_("runner.compile.start"));
  const rawCode = get(monacoEditorCode);

  accordionOpen.update((p) => ({ ...p, compileLog: true }));

  const res = await compiler(rawCode);
  if (res.code === 0) {
    compiledCode.set(rawCode);
    compiledData.set(Uint8Array.from((res.binary as any).data));
    greenToast(_("runner.compile.succeeded"));
  } else {
    compileLogOut(res.message);
    redToast(_("runner.compile.failed"));
  }
  return res.code;
};
