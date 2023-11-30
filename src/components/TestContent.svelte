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

  import { lz } from "../store";
  import { recoveryCode } from "../editor/utils";
  import type { FunctionTest, MainTest } from "../test";

  let functionTests: FunctionTest[] | undefined = undefined;
  let mainTests: MainTest[] | undefined = undefined;

  onMount(() => {
    console.log(recoveryCode());
    const tests = recoveryCode().tests;
    functionTests = tests?.filter((t) => t.type === "function") as FunctionTest[] | undefined;
    mainTests = tests?.filter((t) => t.type === "main") as MainTest[] | undefined;
  });
  lz.subscribe(() => {
    const tests = recoveryCode().tests;
    functionTests = tests?.filter((t) => t.type === "function") as FunctionTest[] | undefined;
    mainTests = tests?.filter((t) => t.type === "main") as MainTest[] | undefined;
  });
</script>

<Tile light style="width:100%; line-height: normal;">
  {#if functionTests || mainTests}
    <StructuredList style="margin-bottom: 0;">
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
        {#if functionTests}
          {#each functionTests as t}
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
        {/if}
      </StructuredListBody>
    </StructuredList>
    <StructuredList>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>TestName</StructuredListCell>
          <StructuredListCell head>Function Name</StructuredListCell>
          <StructuredListCell head>stdin</StructuredListCell>
          <StructuredListCell head>stdout</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#if mainTests}
          {#each mainTests as t}
            <StructuredListRow>
              <StructuredListCell>{t.testName}</StructuredListCell>
              <StructuredListCell>{t.functionName}</StructuredListCell>
              {#if t.type === "main"}
                <StructuredListCell
                  >{t.stdin
                    .map((v) => v + "\n")
                    .join("")
                    .replaceAll("\n", "\\n")}</StructuredListCell
                >
                <StructuredListCell>{t.stdout.replaceAll("\n", "\\n")}</StructuredListCell>
              {/if}
            </StructuredListRow>
          {/each}
        {/if}
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
