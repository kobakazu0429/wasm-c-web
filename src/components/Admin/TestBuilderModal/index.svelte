<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(false);
  export const openTestBuilderModal = () => {
    modalOpenStatus.set(true);
  };
  const closeTestBuilderModal = () => {
    modalOpenStatus.set(false);
  };
</script>

<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Modal } from "carbon-components-svelte";
  import { TextInput, Button, Toggle, TextArea } from "carbon-components-svelte";
  import AddAlt from "carbon-icons-svelte/lib/AddAlt.svelte";
  import Arguments from "./Arguments.svelte";
  import ReturnValue from "./CTypeValue.svelte";

  import {
    buildingTestsAdder,
    currentModal,
    resetCurrentModalTypeFunction,
    resetCurrentModalTypeMain,
    argumentsValueAdder,
    buildingTestsDeleter
  } from "../../../stores/admin";
  import { ulid } from "ulid";

  let isTestTypeAsFunction = $currentModal.type === "function";

  const buildingTestsAdd = () => {
    buildingTestsAdder({
      ...$currentModal,
      id: ulid()
    });
  };

  const confirm = () => {
    const id = $currentModal.id;
    const isUpdate = id !== "";
    if (isUpdate) {
      buildingTestsDeleter(id);
    }
    buildingTestsAdd();
    $currentModal.type === "function"
      ? resetCurrentModalTypeFunction()
      : resetCurrentModalTypeMain();
    closeTestBuilderModal();
  };

  const cancel = () => {
    $currentModal.type === "function"
      ? resetCurrentModalTypeFunction()
      : resetCurrentModalTypeMain();
    closeTestBuilderModal();
  };
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading={$_("admin.form.tests.builder.create_test")}
  primaryButtonText={$_("admin.modal.primary_button_text")}
  secondaryButtonText={$_("admin.modal.secondary_button_text")}
  shouldSubmitOnEnter={false}
  on:click:button--primary={confirm}
  on:click:button--secondary={cancel}
  on:close={closeTestBuilderModal}
>
  <div style="margin-bottom:30px;">
    <Toggle
      labelText="test type"
      labelA="main"
      labelB="function"
      bind:toggled={isTestTypeAsFunction}
      on:toggle={(e) => {
        if (e.detail.toggled) {
          resetCurrentModalTypeFunction();
        } else {
          resetCurrentModalTypeMain();
        }
      }}
    />
  </div>
  {#if $currentModal.type === "function"}
    <div style="margin-bottom:30px;">
      <TextInput
        labelText={$_("admin.form.tests.test_name.label_text")}
        bind:value={$currentModal.testName}
      />
    </div>
    <div style="margin-bottom:30px;">
      <TextInput
        labelText={$_("admin.form.tests.function_name.label_text")}
        bind:value={$currentModal.functionName}
      />
    </div>
    <!-- <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.arguments_value.label_text")}
      placeholder={$_("admin.form.tests.arguments_value.placeholder")}
      helperText={$_("admin.form.tests.arguments_value.helper_text")}
      bind:value={$currentModal.argumentsValue}
    />
  </div> -->
    <div style="margin-bottom:30px;">
      <label for="arguments-value" class="bx--label"
        >{$_("admin.form.tests.arguments_value.label_text")}{$_(
          "admin.form.tests.arguments_value.helper_text"
        )}</label
      >
      <Arguments />
      <Button
        iconDescription={$_("setting_modal.add")}
        tooltipPosition="right"
        icon={AddAlt}
        on:click={argumentsValueAdder}
      />
    </div>
    <div style="margin-bottom:30px;">
      <label for="return-value" class="bx--label"
        >{$_("admin.form.tests.return_value.label_text")}{$_(
          "admin.form.tests.return_value.helper_text"
        )}</label
      >
      <!-- <TextInput
      labelText={$_("admin.form.tests.return_value.label_text")}
      bind:value={$currentModal.returnValue}
      helperText={$_("admin.form.tests.return_value.helper_text")}
    /> -->
      <ReturnValue
        bind:value={$currentModal.returnValue.value}
        bind:type={$currentModal.returnValue.type}
      />
    </div>
    <div style="margin-bottom:30px;">
      <TextInput
        labelText={$_("admin.form.tests.return_precision.label_text")}
        bind:value={$currentModal.returnPrecision}
        placeholder={$_("admin.form.tests.return_precision.placeholder")}
        helperText={$_("admin.form.tests.return_precision.helper_text")}
      />
    </div>
  {:else}
    <div style="margin-bottom:30px;">
      <TextInput
        labelText={$_("admin.form.tests.test_name.label_text")}
        bind:value={$currentModal.testName}
      />
    </div>

    <div style="margin-bottom:30px;">
      <TextInput
        labelText={$_("admin.form.tests.function_name.label_text")}
        value="main"
        readonly
      />
    </div>
    <div style="margin-bottom:30px;">
      <TextArea
        labelText="stdin"
        placeholder="Enter a stdin text"
        bind:value={$currentModal.stdin}
      />
    </div>
    <div style="margin-bottom:30px;">
      <TextArea
        labelText="stdout"
        placeholder="Enter a stdout text"
        bind:value={$currentModal.stdout}
      />
    </div>
  {/if}
</Modal>

<style>
  :global(.bx--modal-container) {
    min-height: 450px !important;
  }

  :global(.bx--modal-container .bx--modal-content) {
    padding-right: 1rem;
  }
</style>
