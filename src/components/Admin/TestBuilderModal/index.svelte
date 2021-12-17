<script lang="ts" context="module">
  import { writable } from "svelte/store";
  const modalOpenStatus = writable(false);
  export const openTestBuilderModal = () => {
    modalOpenStatus.set(true);
  };

  const closeTestBuilderModal = () => {
    modalOpenStatus.set(false);
  };

  const modalValues: Omit<Row, "id"> = {
    testName: "",
    functionName: "",
    argumentsValue: "",
    returnValue: "",
    returnPrecision: 0,
  };

  export const setValues = (data: {
    testName: string;
    functionName: string;
    argumentsValue: string;
    returnValue: string;
    returnPrecision: number;
  }) => {
    modalValues.testName = data.testName;
    modalValues.functionName = data.functionName;
    modalValues.argumentsValue = data.argumentsValue;
    modalValues.returnValue = data.returnValue;
    modalValues.returnPrecision = data.returnPrecision;
  };

  export const resetValues = () => {
    modalValues.testName = "";
    modalValues.functionName = "";
    modalValues.argumentsValue = "";
    modalValues.returnValue = "";
    modalValues.returnPrecision = 0;
  };
</script>

<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Modal } from "carbon-components-svelte";
  import { TextInput } from "carbon-components-svelte";
  import { buildingTestsAdder } from "../../../stores/admin";
  import { ulid } from "ulid";
  import type { Row } from "../TestsBuildTable/table";

  const buildingTestsAdd = () => {
    buildingTestsAdder({
      id: ulid(),
      testName: modalValues.testName,
      functionName: modalValues.functionName,
      argumentsValue: modalValues.argumentsValue,
      returnValue: modalValues.returnValue,
      returnPrecision: modalValues.returnPrecision,
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
      labelText={$_("admin.form.tests.test_name.label_text")}
      bind:value={modalValues.testName}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.function_name.label_text")}
      bind:value={modalValues.functionName}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.arguments_value.label_text")}
      placeholder={$_("admin.form.tests.arguments_value.placeholder")}
      helperText={$_("admin.form.tests.arguments_value.helper_text")}
      bind:value={modalValues.argumentsValue}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.return_value.label_text")}
      bind:value={modalValues.returnValue}
      helperText={$_("admin.form.tests.return_value.helper_text")}
    />
  </div>
  <div style="margin-bottom:30px;">
    <TextInput
      labelText={$_("admin.form.tests.return_precision.label_text")}
      bind:value={modalValues.returnPrecision}
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
