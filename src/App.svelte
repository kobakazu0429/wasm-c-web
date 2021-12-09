<script lang="ts">
  import { _ } from "svelte-i18n";
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
  import OverflowMenu from "./components/OverflowMenu.svelte";
  import { enableFullScreenEditor } from "./editor/fullscreen";
  import { registerHotkeys } from "./hotkeys";
  import { onDestroy, onMount } from "svelte";
  import { formatCode, newFile } from "./editor/utils";
  import { compile } from "./runners/compile";
  import { run } from "./runners/exec";
  import { test } from "./runners/test";
  import { accordionOpen } from "./store";
  import { initI18n } from "./i18n";

  initI18n();

  let unregisterHotkeys: any;
  onMount(() => {
    unregisterHotkeys = registerHotkeys();
  });

  onDestroy(() => {
    unregisterHotkeys();
  });
</script>

<svelte:head>
  <title>{$_("main_page_title")}</title>
</svelte:head>

<SvelteToast />
<SettingModal />

<Header company="wasm-c-web">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <ButtonSet class="header-buttons" style="width:100%;">
    <Button size="small" kind="secondary" on:click={newFile}>{$_("header.new_file")}</Button>
    <Button size="small" kind="secondary" on:click={compile}>{$_("header.compile")}</Button>
    <Button size="small" kind="secondary" on:click={run}>{$_("header.run")}</Button>
    <Button size="small" kind="secondary" on:click={test}>{$_("header.test")}</Button>
    <Button size="small" kind="secondary" on:click={formatCode}>{$_("header.format")}</Button>
    <OverflowMenu />
    <Button
      size="small"
      kind="secondary"
      on:click={enableFullScreenEditor}
      style="margin-left:auto;">{$_("header.fullscreen_editor")}</Button
    >
    <Button
      size="small"
      kind="secondary"
      on:click={openSettingModal}
      style="margin-right:16px">{$_("header.setting")}</Button
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
          <AccordionItem
            class="full-width-accordion-item"
            open={$accordionOpen.console}
          >
            <div slot="title">
              <h5>{$_("right_accordion.console")}</h5>
            </div>
            <Console />
          </AccordionItem>
          <AccordionItem
            class="full-width-accordion-item"
            open={$accordionOpen.compileLog}
          >
            <div slot="title">
              <h5>{$_("right_accordion.compile_log")}</h5>
            </div>
            <CompileLog />
          </AccordionItem>
          <AccordionItem
            class="full-width-accordion-item"
            open={$accordionOpen.testResult}
          >
            <div slot="title">
              <h5>{$_("right_accordion.test_result")}</h5>
            </div>
            <TestResult />
          </AccordionItem>
          <AccordionItem
            class="full-width-accordion-item"
            open={$accordionOpen.testContent}
          >
            <div slot="title">
              <h5>{$_("right_accordion.test_content")}</h5>
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
