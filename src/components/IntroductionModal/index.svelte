<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(true);
  export const openSettingModal = () => {
    modalOpenStatus.set(true);
  };
</script>

<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Modal } from "carbon-components-svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import Renderer from "./ContentRenderer.svelte";
  import type { RawBody } from "./ContentRenderer.svelte";

  const howToUseBody = ($_(
    "introduction_modal.body.how_to_use"
  ) as any) as Array<RawBody>;
  const hotkeysBody = ($_(
    "introduction_modal.body.hotkeys"
  ) as any) as Array<RawBody>;
  const tipsBody = ($_(
    "introduction_modal.body.tips"
  ) as any) as Array<RawBody>;
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading={$_("introduction_modal.modal_heading")}
  passiveModal
  on:close={() => {
    modalOpenStatus.set(false);
  }}
>
  <Tabs>
    <Tab label={$_("introduction_modal.label.how_to_use")} />
    <Tab label={$_("introduction_modal.label.hotkeys")} />
    <Tab label={$_("introduction_modal.label.tips")} />
    <div slot="content">
      <!-- how_to_use -->
      <TabContent><Renderer body={howToUseBody} /></TabContent>

      <!-- hotkeys -->
      <TabContent><Renderer body={hotkeysBody} /></TabContent>

      <!-- tips -->
      <TabContent><Renderer body={tipsBody} /></TabContent>
    </div>
  </Tabs>
</Modal>

<style>
  :global(.bx--modal-container) {
    min-height: 450px !important;
  }

  :global(.bx--modal-container .bx--modal-content) {
    padding-right: 1rem;
  }
</style>
