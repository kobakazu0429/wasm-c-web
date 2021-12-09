import { get } from "svelte/store";
import { toast } from "@zerodevx/svelte-toast";
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
          toast.push(
            `タイムアウトしたため現在の処理を中断します。(${ms} [ms])`
          );
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

  const runtimeWorker = new RuntimeWorker();
  const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(
    runtimeWorker
  );
  const task = runtimeWorkerComlink.startWasiTask(
    module,
    Comlink.proxy(consolePrintln),
    Comlink.proxy(readLine)
  );

  controller.signal.addEventListener("abort", () => {
    runtimeWorker.terminate();
  });

  await Promise.race([task, timeouter(timeoutMs)]);
  // @ts-expect-error
  if (timeouterId) clearTimeout(timeouterId);
};
