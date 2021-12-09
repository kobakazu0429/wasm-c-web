import { get } from "svelte/store";
import * as Comlink from "comlink";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  monacoEditorCode,
  testResultOut,
} from "../store";
import { compile } from "./compile";
import { STATUS_CODE } from "./status";
import type { RuntimeWorkerExposes } from "../workers/runtime.worker";
import RuntimeWorker from "../workers/runtime.worker?worker";
import type { Test } from "../jest";
import { constructResultsHTML } from "@kobakazu0429/test";
import { normalToast } from "./../toast/index";

const demoData2: Test[] = [
  {
    name: "sum(1, 2) should be 3",
    functionName: "sum",
    input: [1, 2],
    expect: 3,
  },
  {
    name: "div(8, 2) should be 4",
    functionName: "div",
    input: [8, 2],
    expect: 4,
  },
  {
    name: "div(10, 3) should be 3.3333",
    functionName: "div",
    input: [10, 3],
    expect: 3.3333,
  },
];

export const test = async () => {
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
    testContent: true,
  }));

  normalToast("[test] start");

  const runtimeWorker = new RuntimeWorker();
  const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(
    runtimeWorker
  );
  const result = await runtimeWorkerComlink.testWasi(module, demoData2);
  const html = constructResultsHTML(result);
  testResultOut(html);

  normalToast("[test] finished");
};
