<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    Button,
    ButtonSet,
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarContent,
  } from "carbon-components-svelte";
  import {
    buildingTests,
    buildingTestsAllDelete,
    buildingTestsDeleter,
    buildingTestsToArray,
    currentModal,
    resetCurrentModal,
  } from "../../../stores/admin";
  import { openTestBuilderModal } from "../TestBuilderModal/index.svelte";
  import { get } from "svelte/store";
  import type { Test } from "../../../jest";

  const headers: Array<
    | { key: Exclude<keyof Test, "id">; value: string }
    | { key: "overflow"; empty: boolean }
  > = [
    { key: "testName", value: $_("admin.form.tests.test_name.label_text") },
    {
      key: "functionName",
      value: $_("admin.form.tests.function_name.label_text"),
    },
    {
      key: "argumentsValue",
      value: $_("admin.form.tests.arguments_value.label_text"),
    },
    {
      key: "returnValue",
      value: $_("admin.form.tests.return_value.label_text"),
    },
    {
      key: "returnPrecision",
      value: $_("admin.form.tests.return_precision.label_text"),
    },
    { key: "overflow", empty: true },
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
  rows={$buildingTestsToArray}
  sortable
>
  <Toolbar>
    <ToolbarContent>
      <ButtonSet>
        <Button kind="danger" on:click={buildingTestsAllDelete}>
          {$_("admin.form.tests.builder.delete_all")}
        </Button>
        <Button
          on:click={() => {
            resetCurrentModal();
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
