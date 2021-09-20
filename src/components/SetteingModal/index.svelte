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
  import InlineTextBothInput from "./InlineTextBothInput.svelte";

  let argvs = ["./main"];
  let env = [
    { key: "LANG", value: "ja_JP.UTF-8" },
    { key: "HOME", value: "/home/user" },
    { key: "USER", value: "user" },
  ];

  function addArgvs() {
    argvs = [...argvs, ""];
  }

  function removeArgvs(i: number) {
    argvs.splice(i, 1);
    argvs = argvs;
  }

  function addEnv() {
    env.push({ key: "", value: "" });
    env = env;
  }

  function removeEnv(i: number) {
    env.splice(i, 1);
    env = env;
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
      <TabContent>
        {#each env as e, i}
          <InlineTextBothInput
            group={env}
            bind:key={e.key}
            bind:value={e.value}
            handleRemove={() => removeEnv(i)}
          />
        {/each}

        <Button
          iconDescription="Add"
          tooltipPosition="right"
          hasIconOnly
          icon={AddAlt32}
          on:click={addEnv}
        />
      </TabContent>

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
