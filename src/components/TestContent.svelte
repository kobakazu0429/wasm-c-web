<script lang="ts">
  import {
    Tile,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody
  } from "carbon-components-svelte";
  import { onMount } from "svelte";

  import { recoveryCode, type RecoveryCode } from "../editor/utils";
  import { lz } from "../store";
  let tests: RecoveryCode["tests"];
  onMount(() => {
    tests = recoveryCode().tests;
  });
  lz.subscribe(() => {
    tests = recoveryCode().tests;
  });
</script>

<Tile light style="width:100%; line-height: normal;">
  {#if tests}
    <StructuredList border>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>TestName</StructuredListCell>
          <StructuredListCell head>Function Name</StructuredListCell>
          <StructuredListCell head>argumentsValues</StructuredListCell>
          <StructuredListCell head>returnValue</StructuredListCell>
          <StructuredListCell head>returnPrecision</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#each tests as t}
          <StructuredListRow>
            <StructuredListCell>{t.testName}</StructuredListCell>
            <StructuredListCell>{t.functionName}</StructuredListCell>
            <StructuredListCell
              >{t.argumentsValues
                .map((a) => `(${a.type}) ${a.value}`)
                .join(", ")}</StructuredListCell
            >
            <StructuredListCell>({t.returnValue.type}) {t.returnValue.value}</StructuredListCell>
            <StructuredListCell>{t.returnPrecision}</StructuredListCell>
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
  {:else}
    <span>no test</span>
  {/if}
</Tile>

<style>
  :global(.bx--structured-list-tbody .bx--structured-list-row):not(:last-child) {
    border-bottom: 1px solid #c6c6c6;
  }
</style>
