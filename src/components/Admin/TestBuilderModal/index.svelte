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
  import { TextInput, Button } from "carbon-components-svelte";
  import AddAlt32 from "carbon-icons-svelte/lib/AddAlt32";
  import Arguments from "./Arguments.svelte";
  import ReturnValue from "./CTypeValue.svelte";

  import {
    buildingTestsAdder,
    currentModal,
    resetCurrentModal,
    argumentsValueAdder,
  } from "../../../stores/admin";
  import { ulid } from "ulid";

  const buildingTestsAdd = () => {
    buildingTestsAdder({
      ...$currentModal,
      id: ulid(),
    });
  };

  const confirm = () => {
    buildingTestsAdd();
    resetCurrentModal();
    closeTestBuilderModal();
  };

  const cancel = () => {
    resetCurrentModal();
    closeTestBuilderModal();
  };
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading={$_("admin.form.tests.builder.create_test")}
  primaryButtonText={$_("admin.modal.primary_button_text")}
  secondaryButtonText={$_("admin.modal.secondary_button_text")}
  on:click:button--primary={confirm}
  on:click:button--secondary={cancel}
  on:close={closeTestBuilderModal}
>
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
      hasIconOnly
      icon={AddAlt32}
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
</Modal>

<style>
  :global(.bx--modal-container) {
    min-height: 450px !important;
  }

  :global(.bx--modal-container .bx--modal-content) {
    padding-right: 1rem;
  }
</style>
