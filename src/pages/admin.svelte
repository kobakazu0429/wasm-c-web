<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Header, SkipToContent, Content, Grid, Row, Column } from "carbon-components-svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Editor from "../components/Editor.svelte";
  import TestBuildTable from "../components/Admin/TestsBuildTable/index.svelte";
  import TestBuilderModal from "../components/Admin/TestBuilderModal/index.svelte";
  import CreatedUrl from "../components/Admin/CreatedUrl.svelte";
  import RecoveryFromUrl from "../components/Admin/RecoveryFromUrl.svelte";
  import { initI18n } from "../i18n";

  initI18n();
</script>

<svelte:head>
  <title>{$_("admin_page_title")}</title>
</svelte:head>

<SvelteToast />
<TestBuilderModal />

<Header company="[admin] wasm-c-web">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
</Header>

<Content style="background-color: #393939; height: calc(100% - 3rem);">
  <Grid fullWidth style="height: 100%; display: flex; flex-direction: column;">
    <Row>
      <Column noGutter>
        <RecoveryFromUrl />
      </Column>
    </Row>

    <Row style="height: 100%;">
      <Column
        noGutter
        style="border: 2px solid #262626; border-right: 1px solid #262626; padding: 16px; padding-bottom: 0px; height: 100%; width: 100%; max-width: 100%;"
      >
        <!-- <FormGroup style="margin-bottom: 30px;">
          <TextInput
            labelText={$_("admin.form.filename.label_text")}
            helperText={$_("admin.form.filename.helper_text")}
            placeholder={$_("admin.form.filename.placeholder")}
          />
        </FormGroup> -->

        <div
          style="height: calc(100% - 40px); max-height: calc(100% - 40px); width: 100%; max-width: 100%; overflow: hidden;"
        >
          <span class="bx--label">{$_("admin.form.editor.label_text")}</span>
          <Editor />
        </div>
      </Column>

      <Column style="border: 2px solid #262626; border-left: 1px solid #262626; padding: 16px;">
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="overflow-y: scroll; flex-grow: 1;">
            <TestBuildTable />
          </div>
          <div style="flex-grow: 0;">
            <CreatedUrl />
          </div>
        </div>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    height: calc(100vh - 3rem);
  }

  :global(.full-width-accordion-item > div) {
    padding-right: 1rem;
  }

  :global(.bx--header__name) {
    flex-shrink: 0;
  }

  :global(.bx--btn-set .bx--btn) {
    max-width: 10rem;
  }
</style>
