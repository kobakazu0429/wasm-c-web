<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(false);
  export const openSettingModal = () => {
    modalOpenStatus.set(true);
  };
</script>

<script lang="ts">
  import { _, locale } from "svelte-i18n";
  import { Dropdown } from "carbon-components-svelte";
  import { Modal } from "carbon-components-svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import AddAlt from "carbon-icons-svelte/lib/AddAlt.svelte";
  import InlineTextInput from "./InlineTextInput.svelte";
  import InlineTextBothInput from "./InlineTextBothInput.svelte";
  import { settings, settingsAdder, settingsRemover } from "../../store";

  const languages = [
    { id: "0", text: "日本語(Japanese)" },
    { id: "1", text: "英語(English)" },
  ];

  const languagesIdLocalMap = new Map([
    ["0", "ja"],
    ["1", "en"],
  ]);

  type DropdownEvent = Parameters<
    NonNullable<Parameters<(typeof Dropdown)["prototype"]["$on"]>[1]>
  >[0];

  const onSelectLanguage = (e: DropdownEvent) => {
    const local = languagesIdLocalMap.get(e.detail.selectedId);
    locale.set(local);
  };
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading={$_("setting_modal.modal_heading")}
  passiveModal
  hasForm
  on:close={() => {
    modalOpenStatus.set(false);
  }}
>
  <Tabs>
    <Tab label={$_("setting_modal.label.editor")} />
    <Tab label={$_("setting_modal.label.config")} />
    <Tab label={$_("setting_modal.label.env")} />
    <Tab label={$_("setting_modal.label.argv")} />
    <div slot="content">
      <!-- Editor -->
      <TabContent>
        <Dropdown
          type="inline"
          titleText={$_("setting_modal.language.title")}
          selectedId="0"
          items={languages}
          on:select={onSelectLanguage}
        />
      </TabContent>

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
          iconDescription={$_("setting_modal.add")}
          tooltipPosition="right"
          icon={AddAlt}
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
          iconDescription={$_("setting_modal.add")}
          tooltipPosition="right"
          icon={AddAlt}
          on:click={() => settingsAdder("argvs")}
        />
      </TabContent>
    </div>
  </Tabs>
</Modal>

<style>
  :global(.bx--modal-container) {
    min-height: 450px !important;
  }
</style>
