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
  import type { HeaderKey, Row } from "./table";
  import {
    buildingTestsAdder,
    buildingTestsAllDelete,
    buildingTestsDeleter,
    buildingTestsToArray,
  } from "../../../stores/admin";
  import { openTestBuilderModal } from "../TestBuilderModal/index.svelte";
  import { ulid } from "ulid";

  const headers: Array<
    { key: HeaderKey; value: any } | { key: "overflow"; empty: boolean }
  > = [
    { key: "name", value: $_("admin.form.tests.name.label_text") },
    {
      key: "functionName",
      value: $_("admin.form.tests.function_name.label_text"),
    },
    { key: "arguments", value: $_("admin.form.tests.arguments.label_text") },
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

  const rows: Row[] = [
    {
      id: ulid(),
      name: "sum(1, 2) should be 3",
      functionName: "sum",
      arguments: `[${[1, 2].toString()}]`,
      returnValue: 3,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(8, 2) should be 4",
      functionName: "div",
      arguments: `[${[8, 2].toString()}]`,
      returnValue: 4,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(10, 3) should be 3.3333",
      functionName: "div",
      arguments: `[${[10, 3].toString()}]`,
      returnValue: 3.3333,
      returnPrecision: 4,
    },
    {
      id: ulid(),
      name: "sum(1, 2) should be 3",
      functionName: "sum",
      arguments: `[${[1, 2].toString()}]`,
      returnValue: 3,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(8, 2) should be 4",
      functionName: "div",
      arguments: `[${[8, 2].toString()}]`,
      returnValue: 4,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(10, 3) should be 3.3333",
      functionName: "div",
      arguments: `[${[10, 3].toString()}]`,
      returnValue: 3.3333,
      returnPrecision: 4,
    },
    {
      id: ulid(),
      name: "sum(1, 2) should be 3",
      functionName: "sum",
      arguments: `[${[1, 2].toString()}]`,
      returnValue: 3,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(8, 2) should be 4",
      functionName: "div",
      arguments: `[${[8, 2].toString()}]`,
      returnValue: 4,
      returnPrecision: 0,
    },
    {
      id: ulid(),
      name: "div(10, 3) should be 3.3333",
      functionName: "div",
      arguments: `[${[10, 3].toString()}]`,
      returnValue: 3.3333,
      returnPrecision: 4,
    },
  ];

  rows.forEach((r) => buildingTestsAdder(r));
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
        <Button on:click={openTestBuilderModal}
          >{$_("admin.form.tests.builder.create_test")}</Button
        >
      </ButtonSet>
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell let:row>
    {#if cell.key === "overflow"}
      <OverflowMenu flipped>
        <OverflowMenuItem
          danger
          text={$_("admin.form.tests.builder.delete")}
          on:click={() => buildingTestsDeleter(row.id)}
        />
      </OverflowMenu>
    {:else}{cell.value}{/if}
  </span>
</DataTable>
