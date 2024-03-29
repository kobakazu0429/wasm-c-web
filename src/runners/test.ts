import { get } from "svelte/store";
import * as Comlink from "comlink";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  monacoEditorCode,
  testResultOut
} from "../store";
import { compile } from "./compile";
import { STATUS_CODE } from "./status";
import type { RuntimeWorkerExposes } from "../workers/runtime.worker";
import RuntimeWorker from "../workers/runtime.worker?worker";
import { constructResultsHTML } from "@kobakazu0429/test";
import { normalToast, redToast } from "./../toast/index";
import { _ } from "../i18n";
import { recoveryCode } from "../editor/utils";
import { testsSchema } from "../test";

export const test = async () => {
  const { tests } = recoveryCode();
  if (!tests) {
    normalToast(_("runner.test.not_found"));
    return;
  }

  try {
    testsSchema.parse(tests);
  } catch (error) {
    console.error(error);
    redToast(_("runner.test.invalid"));
    return;
  }

  if (get(compiledCode) !== get(monacoEditorCode)) {
    const status = await compile();
    if (status !== STATUS_CODE.OK) return;
  }

  const module = get(compiledData);
  if (!module) return;

  accordionOpen.update((p) => ({
    ...p,
    console: false,
    testResult: true,
    testContent: true
  }));

  normalToast(_("runner.test.start"));

  const runtimeWorker = new RuntimeWorker();
  const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(runtimeWorker);
  const result = await runtimeWorkerComlink.testWasi(module, tests);
  const html = constructResultsHTML(result);
  testResultOut(html);

  normalToast(_("runner.test.finished"));
};
