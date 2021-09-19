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
  import { TextInput } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import AddAlt32 from "carbon-icons-svelte/lib/AddAlt32";
  import Close24 from "carbon-icons-svelte/lib/Close24";

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
          <div class="inline">
            <TextInput
              inline
              labelText={`argv[${i}]`}
              bind:value={argv}
              readonly={i === 0}
            />
            <Button
              kind="danger-ghost"
              size="small"
              hasIconOnly
              disabled={i === 0}
              on:click={() => removeArgvs(i)}
            >
              <Close24 />
            </Button>
          </div>
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
