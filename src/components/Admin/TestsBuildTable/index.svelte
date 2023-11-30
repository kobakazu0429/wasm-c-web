<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    Button,
    ButtonSet,
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarContent
  } from "carbon-components-svelte";
  import {
    buildingTests,
    buildingTestsAllDelete,
    buildingTestsDeleter,
    displayBuildingTestsTable,
    currentModal,
    resetCurrentModalTypeFunction,
    resetCurrentModalTypeMain
  } from "../../../stores/admin";
  import { openTestBuilderModal } from "../TestBuilderModal/index.svelte";
  import { get } from "svelte/store";

  const headers = [
    { key: "type", value: "type" },
    { key: "testName", value: $_("admin.form.tests.test_name.label_text") },
    {
      key: "functionName",
      value: $_("admin.form.tests.function_name.label_text")
    },
    {
      key: "argumentsValues",
      value: $_("admin.form.tests.arguments_value.label_text")
    },
    {
      key: "returnValue",
      value: $_("admin.form.tests.return_value.label_text")
    },
    {
      key: "returnPrecision",
      value: $_("admin.form.tests.return_precision.label_text")
    },
    { key: "stdin", value: "stdin" },
    { key: "stdout", value: "stdout" },
    { key: "overflow", empty: true }
  ];

  const setToModal = (id: string) => {
    const v = get(buildingTests).get(id);
    if (v) {
      currentModal.set(v);
      openTestBuilderModal();
    }
  };
</script>

<DataTable
  title={$_("admin.form.tests.builder.title")}
  description={$_("admin.form.tests.builder.description")}
  {headers}
  rows={$displayBuildingTestsTable}
  sortable
>
  <Toolbar>
    <ToolbarContent>
      <ButtonSet style="justify-content: end;">
        <Button
          kind="danger"
          on:click={() => {
            const result = window.confirm($_("admin.form.tests.builder.delete_all_confirm"));
            if (result) buildingTestsAllDelete();
          }}
        >
          {$_("admin.form.tests.builder.delete_all")}
        </Button>
        <Button
          on:click={() => {
            resetCurrentModalTypeMain();
            resetCurrentModalTypeFunction();
            openTestBuilderModal();
          }}>{$_("admin.form.tests.builder.create_test")}</Button
        >
      </ButtonSet>
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell let:row>
    {#if cell.key === "overflow"}
      <OverflowMenu flipped>
        <OverflowMenuItem
          text={$_("admin.form.tests.builder.edit")}
          on:click={() => setToModal(row.id)}
        />
        <OverflowMenuItem
          danger
          text={$_("admin.form.tests.builder.delete")}
          on:click={() => buildingTestsDeleter(row.id)}
        />
      </OverflowMenu>
    {:else}{cell.value}{/if}
  </span>
</DataTable>
