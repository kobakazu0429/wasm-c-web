<script lang="ts">
  // import { stringOut, OpenFiles, Bindings, bufferIn } from "@kobakazu0429/wasi";
  // import type { In } from "@kobakazu0429/wasi";
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
  } from "./store";
  import { run as runTest, prettify, testBuilder } from "./jest";
  import type { TestFixture } from "./jest";
  import { enableFullScreenEditor } from "./editor/fullscreen";
  import { startWasiTask } from "./runtime";
  import RuntimeWorker from "./workers/runtime.worker?worker";

  const StatusCode = {
    OK: 0,
    ERROR: 10,
    UNKNOWN: 90,
  } as const;

  let rawCode = "";
  let compiledCode = "";
  let compiledData: BufferSource | null = null;
  let compiledStatusCode = -1;
  monacoEditorCode.subscribe((code) => {
    rawCode = code;
  });

  const demoData2: TestFixture = {
    title: "function",
    tests: [
      {
        title: "sum",
        tests: [
          {
            name: "sum(1, 2) should be 3",
            functionName: "sum",
            input: [1, 2],
            expect: 3,
          },
        ],
      },
      {
        title: "div",
        tests: [
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
        ],
      },
    ],
  };

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

  const textEncoder = new TextEncoder();

  async function run() {
    if (compiledCode !== rawCode) await compile();
    if (!compiledData || compiledStatusCode !== StatusCode.OK) return;

    // const module = WebAssembly.compile(compiledData);

    const timeoutMs =
      parseInt(
        $settings.config.find((e) => e.key === "timeout [ms]")?.value as string,
        10
      ) || 3000;
    const controller = new AbortController();
    const timeouter = (ms: number) => {
      return new Promise<void>((resolve) =>
        setTimeout(() => {
          controller.abort();
          resolve();
        }, ms)
      );
    };

    const useFileSystem = $settings.config.find(
      (e) => e.key === "use File System"
    )?.value;

    // let openFiles: OpenFiles;
    // if (useFileSystem) {
    //   // @ts-expect-error
    //   const rootHandle = await showDirectoryPicker();
    //   const [sandbox, tmp] = await Promise.all([
    //     rootHandle.getDirectoryHandle("sandbox"),
    //     rootHandle.getDirectoryHandle("tmp"),
    //   ]);
    //   openFiles = new OpenFiles({
    //     "/sandbox": sandbox,
    //     "/tmp": tmp,
    //   });
    // } else {
    //   openFiles = new OpenFiles({});
    // }

    // const stdin: In = {
    //   read: async () => {
    //     let input = await readLine();
    //     if (!input.endsWith("\n")) input += "\n";
    //     return textEncoder.encode(input);
    //   },
    // };

    // const exitCode = await new Bindings({
    //   openFiles,
    //   stdin,
    //   // @ts-ignore
    //   stdout: stringOut((s) => {
    //     console.log(s);
    //     consolePrintln(s);
    //   }),
    //   stderr: stringOut((s) => console.log(s)),
    //   args: $settings.argvs.map((a) => a.value),
    //   env: Object.fromEntries($settings.env.map((e) => [e.key, e.value])),
    // }).run(await module);
    // console.log("exitCode", exitCode);

    // startWasiTask(compiledData);
    const runtimeWorker = new RuntimeWorker();
    const runtimeWorkerComlink = Comlink.wrap<
      (wasmBinary: any, stdout: any,stdin:any) => Promise<void>
    >(runtimeWorker);
    runtimeWorkerComlink(compiledData, Comlink.proxy(consolePrintln),Comlink.proxy(readLine));
  }

  async function test() {
    if (compiledCode !== rawCode) await compile();
    if (!compiledData || compiledStatusCode !== StatusCode.OK) return;

    const module = WebAssembly.compile(compiledData);

    // console.log(bufferIn(textEncoder.encode("1\n")));

    // type F = (a: number, b: number) => Promise<number>;
    // const { sum, div } = (await new Bindings({
    //   openFiles: new OpenFiles({}),
    //   stdin: bufferIn(textEncoder.encode("10\n3\n")),
    //   // @ts-ignore
    //   stdout: stringOut((s) => {
    //     console.log(s);
    //     consolePrintln(s);
    //   }),
    //   stderr: stringOut((s) => console.log(s)),
    //   args: ["foo", "-bar", "--baz=value"],
    //   env: {
    //     NODE_PLATFORM: "win32",
    //   },
    // }).exportFunction(await module)) as { [k in "sum" | "div"]: F };

    // const tests = testBuilder(demoData2, {
    //   sum: sum,
    //   div: div,
    // });
    // tests();
    // const result = await runTest();
    // const newLineAlternative = "________";
    // const spaceAlternative = "myspace";
    // const prettty = result.map((v: any) => ({
    //   ...v,
    //   errors: v.errors.map((s: string) =>
    //     s
    //       .split("\n")
    //       .map((c) => c.replaceAll(/\s*at .*/g, ""))
    //       .filter(Boolean)
    //       .join(newLineAlternative)
    //       .replaceAll(" ", spaceAlternative)
    //   ),
    // }));
    // // console.log(JSON.stringify(a, null, 2));
    // // console.log(prettty);
    // const html = prettify.constructResultsHTML(prettty);
    // // console.log(html);
    // testResultOut(
    //   html
    //     .replaceAll(newLineAlternative, "<br>")
    //     .replaceAll(spaceAlternative, "&nbsp;")
    // );
  }
</script>

<SettingModal />

<Header company="wasm-c-web">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <ButtonSet class="header-buttons" style="width:100%;">
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
