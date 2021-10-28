<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(false);
  export const openSettingModal = () => {
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
  import { settings, settingsAdder, settingsRemover } from "../../store";
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading="Setting"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  hasForm
  on:close={() => {
    modalOpenStatus.set(false);
  }}
>
  <Tabs>
    <Tab label="Editor" />
    <Tab label="Config" />
    <Tab label="Env" />
    <Tab label="Argv" />
    <div slot="content">
      <!-- Editor -->
      <TabContent>Content 1</TabContent>

      <!-- Config -->
      <TabContent>
        {#each $settings.config as c, i}
          <InlineTextInput
            labelText={c.key}
            bind:value={c.value}
            handleRemove={() => settingsRemover("config", i)}
          />
        {/each}
      </TabContent>

      <!-- Env -->
      <TabContent>
        {#each $settings.env as e, i}
          <InlineTextBothInput
            bind:key={e.key}
            bind:value={e.value}
            handleRemove={() => settingsRemover("env", i)}
          />
        {/each}

        <Button
          iconDescription="Add"
          tooltipPosition="right"
          hasIconOnly
          icon={AddAlt32}
          on:click={() => settingsAdder("env")}
        />
      </TabContent>

      <!-- Argv -->
      <TabContent>
        {#each $settings.argvs as argv, i}
          <InlineTextInput
            labelText={`argv[${i}]`}
            bind:value={argv.value}
            fixed={argv.fixed}
            deleteIconVisible={true}
            handleRemove={() => settingsRemover("argvs", i)}
          />
        {/each}

        <Button
          iconDescription="Add"
          tooltipPosition="right"
          hasIconOnly
          icon={AddAlt32}
          on:click={() => settingsAdder("argvs")}
        />
      </TabContent>
    </div>
  </Tabs>
</Modal>
