import { get } from "svelte/store";
import * as Comlink from "comlink";
import {
  accordionOpen,
  compiledCode,
  compiledData,
  consolePrintln,
  monacoEditorCode,
  settings as settingsStore,
} from "../store";
import { compile } from "./compile";
import { STATUS_CODE } from "./status";
import type { RuntimeWorkerExposes } from "../workers/runtime.worker";
import RuntimeWorker from "../workers/runtime.worker?worker";
import { readLine } from "../components/Console/terminal";
import { greenToast, normalToast, redToast } from "./../toast/index";
import { _ } from "../i18n";

export const run = async () => {
  if (get(compiledCode) !== get(monacoEditorCode)) {
    const status = await compile();
    if (status !== STATUS_CODE.OK) return;
  }

  const module = get(compiledData);
  if (!module) return;

  const settings = get(settingsStore);
  const timeoutMs =
    parseInt(
      settings.config.find((e) => e.key === "timeout [ms]")?.value as string,
      10
    ) || 3000;
  const controller = new AbortController();
  let timeouterId: NodeJS.Timeout;
  const timeouter = (ms: number) => {
    return new Promise<void>(
      (resolve) =>
        (timeouterId = setTimeout(() => {
          controller.abort();
          redToast(_("runner.exec.timeout", { values: { ms } }));
          resolve();
        }, ms))
    );
  };

  // const useFileSystem = $settings.config.find(
  //   (e) => e.key === "use File System"
  // )?.value;

  // let rootHandle: any = null;
  // if (useFileSystem) {
  //   // @ts-expect-error
  //   rootHandle = await showDirectoryPicker();
  // }

  accordionOpen.update((p) => ({ ...p, console: true }));

  normalToast(_("runner.exec.running"));

  const runtimeWorker = new RuntimeWorker();
  const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(
    runtimeWorker
  );
  const task = runtimeWorkerComlink
    .startWasiTask(
      module,
      Comlink.proxy(consolePrintln),
      Comlink.proxy(readLine)
    )
    .then(() => "done");

  controller.signal.addEventListener("abort", () => {
    runtimeWorker.terminate();
  });

  const result = await Promise.race([task, timeouter(timeoutMs)]);
  if (result === "done") {
    greenToast(_("runner.exec.done"));
  }

  // @ts-expect-error
  if (timeouterId) clearTimeout(timeouterId);
};
