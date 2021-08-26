<script lang="ts">
  import { Wasface } from "wasm-interface";
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

  import Editor from "./components/Editor.svelte";
  import CompileLog from "./components/CompileLog.svelte";
  import Console from "./components/Console.svelte";
  import TestResult from "./components/TestResult.svelte";

  import { c2wasm } from "./wasface";
  import { consoleOut, consoleClear, monacoEditorCode } from "./store";
  import { testResultOut } from "./store";

  import { run as runTest, prettify, testBuilder } from "./jest";
  import type { TestFixture } from "./jest";

  let rawCode = "";
  let compiledCode = "";
  let compiledData: any = null;
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
    const { binary, info } = await c2wasm(rawCode);
    // console.log(info);
    compiledCode = rawCode;
    compiledData = { binary, info };
    return { binary, info };
  }

  let app: Wasface;
  async function run() {
    consoleClear();
    if (compiledCode !== rawCode) await compile();
    if (!compiledData) return;
    console.log(compiledData);

    app = new Wasface();
    app.set("stdout", (s: string) => {
      console.log(s);
      consoleOut(s);
    });
    app.set("stderr", console.error);

    // @ts-ignore
    Object.keys(compiledData.info).forEach((key) => {
      // @ts-ignore
      app.set(key, compiledData.info[key]);
    });

    // excuteButton.disabled = false;
    // excuteButton.addEventListener("click", () => {
    //   console.log("excuting...");
    // @ts-ignore
    await app.init(Uint8Array.from(compiledData.binary));
    await app.run();
  }

  async function test() {
    const sum = await app.runFunction("sum", "number", ["number", "number"]);
    const div = await app.runFunction("div", "number", ["number", "number"]);

    const tests = testBuilder(demoData2, {
      sum: sum,
      div: div,
    });
    tests();
    const result = await runTest();

    const newLineAlternative = "________";
    const spaceAlternative = "myspace";

    const prettty = result.map((v: any) => ({
      ...v,
      errors: v.errors.map((s: string) =>
        s
          .split("\n")
          .map((c) => c.replaceAll(/\s*at .*/g, ""))
          .filter(Boolean)
          .join(newLineAlternative)
          .replaceAll(" ", spaceAlternative)
      ),
    }));
    // console.log(JSON.stringify(a, null, 2));
    // console.log(prettty);
    const html = prettify.constructResultsHTML(prettty);
    // console.log(html);
    testResultOut(
      html
        .replaceAll(newLineAlternative, "<br>")
        .replaceAll(spaceAlternative, "&nbsp;")
    );
  }
</script>

<Header company="wasm-c-web">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <ButtonSet>
    <Button size="small" kind="secondary" on:click={compile}>Compile</Button>
    <Button size="small" kind="secondary" on:click={run}>Run</Button>
    <Button size="small" kind="secondary" on:click={test}>Test</Button>
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
</style>
