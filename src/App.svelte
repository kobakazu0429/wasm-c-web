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
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import SettingModal, {
    openSettingModal,
  } from "./components/SettingModal/index.svelte";
  import Editor from "./components/Editor.svelte";
  import CompileLog from "./components/CompileLog.svelte";
  import Console from "./components/Console/Console.svelte";
  import TestResult from "./components/TestResult.svelte";
  import { enableFullScreenEditor } from "./editor/fullscreen";
  import { registerHotkeys } from "./hotkeys";
  import { onDestroy, onMount } from "svelte";
  import { formatCode, newFile } from "./editor/utils";
  import { compile } from "./runners/compile";
  import { run } from "./runners/exec";
  import { test } from "./runners/test";

  let unregisterHotkeys: any;
  onMount(() => {
    unregisterHotkeys = registerHotkeys();
  });

  onDestroy(() => {
    unregisterHotkeys();
  });
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
    <Button size="small" kind="secondary" on:click={formatCode}>Format</Button>
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
          <AccordionItem class="full-width-accordion-item" open>
            <div slot="title">
              <h5>Compile Log</h5>
            </div>
            <CompileLog />
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item">
            <div slot="title">
              <h5>Test Result</h5>
            </div>
            <TestResult />
          </AccordionItem>
          <AccordionItem class="full-width-accordion-item">
            <div slot="title">
              <h5>Test Content</h5>
            </div>
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
