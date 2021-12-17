<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(true);
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
  import { TextInput } from "carbon-components-svelte";
  import { buildingTestsAdder } from "../../../stores/admin";
  import { ulid } from "ulid";

  let testName = "";
  let functionName = "";
  let argumentsValue = "";
  let returnValue = "";
  let returnPrecision = 0;

  const resetValues = () => {
    testName = "";
    functionName = "";
    argumentsValue = "";
    returnValue = "";
    returnPrecision = 0;
  };

  const buildingTestsAdd = () => {
    buildingTestsAdder({
      id: ulid(),
      name: testName,
      functionName,
      arguments: argumentsValue,
      returnValue,
      returnPrecision,
    });
  };

  const confirm = () => {
    buildingTestsAdd();
    resetValues();
    closeTestBuilderModal();
  };

  const cancel = () => {
    buildingTestsAdd();
    resetValues();
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
      labelText={$_("admin.form.tests.name.label_text")}
      bind:value={testName}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.function_name.label_text")}
      bind:value={functionName}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.arguments.label_text")}
      placeholder={$_("admin.form.tests.arguments.placeholder")}
      helperText={$_("admin.form.tests.arguments.helper_text")}
      bind:value={argumentsValue}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.return_value.label_text")}
      bind:value={returnValue}
      helperText={$_("admin.form.tests.return_value.helper_text")}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.return_precision.label_text")}
      bind:value={returnPrecision}
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
