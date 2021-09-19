<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(!false);
  export const openSettingModal = () => {
    console.log("open");
    modalOpenStatus.set(true);
  };
</script>

<script lang="ts">
  import { Modal } from "carbon-components-svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import AddAlt32 from "carbon-icons-svelte/lib/AddAlt32";
  import InlineTextInput from "./InlineTextInput.svelte";

  let argvs = ["./main"];

  function addArgvs() {
    argvs = [...argvs, ""];
  }

  function removeArgvs(i: number) {
    argvs.splice(i, 1);
    argvs = argvs;
  }
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading="Setting"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  hasForm
  on:close={() => modalOpenStatus.set(false)}
>
  <Tabs>
    <Tab label="Editor" />
    <Tab label="Config" />
    <Tab label="Env" />
    <Tab label="Argv" />
    <div slot="content">
      <TabContent>Content 1</TabContent>
      <TabContent>Content 2</TabContent>
      <TabContent>Content 3</TabContent>
      <TabContent>
        {#each argvs as argv, i}
          <InlineTextInput
            labelText={`argv[${i}]`}
            bind:value={argv}
            fixed={i === 0}
            handleRemove={() => removeArgvs(i)}
          />
        {/each}

        <Button
          iconDescription="Add"
          tooltipPosition="right"
          hasIconOnly
          icon={AddAlt32}
          on:click={addArgvs}
        />
      </TabContent>
    </div>
  </Tabs>
</Modal>

<style>
  .inline {
    display: flex;
  }
</style>
