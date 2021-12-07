<script lang="ts">
  import {
    Header,
    ButtonSet,
    Button,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    Accordion,
    AccordionItem,
  } from "carbon-components-svelte";
  import { SvelteToast, toast } from "@zerodevx/svelte-toast";
  import * as Comlink from "comlink";
  import SettingModal, {
    openSettingModal,
  } from "./components/SettingModal/index.svelte";
  import Editor from "./components/Editor.svelte";
  import CompileLog from "./components/CompileLog.svelte";
  import Console, { readLine } from "./components/Console.svelte";
  import TestResult from "./components/TestResult.svelte";

  import { compiler } from "./compiler";
  import {
    consolePrintln,
    monacoEditorCode,
    compileLogOut,
    testResultOut,
    settings,
    consoleOut,
    editor,
  } from "./store";
  import { constructResultsHTML } from "@kobakazu0429/test";
  import type { Test } from "./jest";
  import { enableFullScreenEditor } from "./editor/fullscreen";
  import type { RuntimeWorkerExposes } from "./workers/runtime.worker";
  import RuntimeWorker from "./workers/runtime.worker?worker";
  import { clearCode } from "./localStorage";
  import { get } from "svelte/store";
  import { registerHotkeys } from "./hotkeys";
  import { onMount } from "svelte";

  onMount(() => {
    registerHotkeys();
  });

  const StatusCode = {
    OK: 0,
    ERROR: 10,
    UNKNOWN: 90,
  } as const;

  let rawCode = "";
  let compiledCode = "";
  let compiledData: Uint8Array | null = null;
  let compiledStatusCode = -1;
  monacoEditorCode.subscribe((code) => {
    rawCode = code;
  });

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

  function newFile() {
    clearCode();
    monacoEditorCode.set("");
    get(editor)?.getModel()?.setValue("");
  }

  async function compile() {
    const res = await compiler(rawCode);
    if (res.code === 0) {
      compiledCode = rawCode;
      compiledData = Uint8Array.from((res.binary as any).data);
    } else {
      compileLogOut(res.message);
    }
    compiledStatusCode = res.code;
  }

  async function run() {
    if (compiledCode !== rawCode) await compile();
    if (!compiledData || compiledStatusCode !== StatusCode.OK) return;

    const timeoutMs =
      parseInt(
        $settings.config.find((e) => e.key === "timeout [ms]")?.value as string,
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

    const runtimeWorker = new RuntimeWorker();
    const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(
      runtimeWorker
    );
    const task = runtimeWorkerComlink.startWasiTask(
      compiledData,
      Comlink.proxy(consolePrintln),
      Comlink.proxy(readLine)
    );

    controller.signal.addEventListener("abort", () => {
      runtimeWorker.terminate();
    });

    await Promise.race([task, timeouter(timeoutMs)]);
    // @ts-expect-error
    if (timeouterId) clearTimeout(timeouterId);
  }

  async function test() {
    if (compiledCode !== rawCode) await compile();
    if (!compiledData || compiledStatusCode !== StatusCode.OK) return;

    const runtimeWorker = new RuntimeWorker();
    const runtimeWorkerComlink = Comlink.wrap<RuntimeWorkerExposes>(
      runtimeWorker
    );
    const result = await runtimeWorkerComlink.testWasi(compiledData, demoData2);
    const html = constructResultsHTML(result);
    testResultOut(html);
  }
</script>

<SvelteToast />
<SettingModal />

<Header company="wasm-c-web">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <ButtonSet class="header-buttons" style="width:100%;">
    <Button size="small" kind="secondary" on:click={newFile}>New File</Button>
    <Button size="small" kind="secondary" on:click={compile}>Compile</Button>
    <Button size="small" kind="secondary" on:click={run}>Run</Button>
    <Button size="small" kind="secondary" on:click={test}>Test</Button>
    <Button
      size="small"
      kind="secondary"
      on:click={enableFullScreenEditor}
      style="margin-left:auto;">Full Screen Editor</Button
    >
    <Button
      size="small"
      kind="secondary"
      on:click={openSettingModal}
      style="margin-right:16px">Setting</Button
    >
  </ButtonSet>
</Header>

<Content style="background-color: #393939; height: calc(100% - 3rem);">
  <Grid fullWidth style="height: 100%;">
    <Row style="height: 100%; margin-bottom:3rem;">
      <Column
        style="border: 2px solid #262626; border-right: 1px solid #262626; padding:0;"
        ><Editor />
      </Column>
      <Column
        style="border: 2px solid #262626; border-left: 1px solid #262626; padding:16px;overflow-y: scroll;max-height: 100%;"
      >
        <Accordion>
          <AccordionItem class="full-width-accordion-item" open>
            <div slot="title">
              <h5>Console (stdin / stdout / stderr)</h5>
            </div>
            <Console />
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item">
            <div slot="title">
              <h5>Test Content</h5>
            </div>
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item" open>
            <div slot="title">
              <h5>Test Result</h5>
            </div>
            <TestResult />
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item" open>
            <div slot="title">
              <h5>Compile Log</h5>
            </div>
            <CompileLog />
          </AccordionItem>
        </Accordion>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  :global(body) {
    height: calc(100vh - 3rem);
  }

  :global(.full-width-accordion-item > div) {
    padding-right: 1rem;
  }

  :global(.bx--header__name) {
    flex-shrink: 0;
  }
</style>
