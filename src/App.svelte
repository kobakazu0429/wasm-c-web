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
  import Console from "./components/Console.svelte";

  import { c2wasm } from "./wasface";
  import { consoleOut, monacoEditorCode } from "./store";

  let rawCode = "";
  let compiledCode = "";
  let compiledData: any = null;
  monacoEditorCode.subscribe((code) => {
    rawCode = code;
  });

  async function compile() {
    console.log(rawCode);
    const { binary, info } = await c2wasm(rawCode);
    // console.log(info);
    compiledCode = rawCode;
    compiledData = { binary, info };
    return { binary, info };
  }

  async function run() {
    if (compiledCode !== rawCode) await compile();
    if (!compiledData) return;
    console.log(compiledData);

    const app = new Wasface();
    app.set("stdout", consoleOut);
    app.set("stderr", consoleOut);

    // @ts-ignore
    Object.keys(compiledData.info).forEach((key) => {
      // @ts-ignore
      app.set(key, compiledData.info[key]);
    });

    // excuteButton.disabled = false;
    // excuteButton.addEventListener("click", () => {
    //   console.log("excuting...");
    //   // @ts-ignore
    // @ts-ignore
    app.init(Uint8Array.from(compiledData.binary));
    // });
  }
</script>

<Header company="IBM" platformName="Carbon Svelte">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <ButtonSet>
    <Button size="small" kind="secondary" on:click={compile}>Compile</Button>
    <Button size="small" kind="secondary" on:click={run}>Run</Button>
    <Button size="small" kind="secondary">Test</Button>
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
            <div>sum(1,2) should be 3</div>
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item">
            <div slot="title">
              <h5>Test Result</h5>
            </div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
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
