<script lang="ts">
  import {
    Tile,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";

  export const testData = {
    title: "function",
    tests: [
      {
        title: "sum",
        tests: [
          {
            name: "sum(1, 2) should be 3",
            functionName: "sum",
            input: [1, 2],
            expect: 3,
          },
        ],
      },
      {
        title: "div",
        tests: [
          {
            name: "div(8, 2) should be 4",
            functionName: "div",
            input: [8, 2],
            expect: 4,
          },
          {
            name: "div(10, 3) should be 3.3333",
            functionName: "div",
            input: [10, 3],
            expect: 3.3333,
          },
        ],
      },
    ],
  };
</script>

<Tile light style="width:100%; line-height: normal;">
  <StructuredList border>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>Title</StructuredListCell>
        <StructuredListCell head>Function Name</StructuredListCell>
        <StructuredListCell head>Description</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      <!-- {#each (testData["tests"]) as t}
        <StructuredListRow>
          <StructuredListCell>function</StructuredListCell>
          <StructuredListCell>{t.functionName}</StructuredListCell>
          <StructuredListCell>
            {t.name}
          </StructuredListCell>
        </StructuredListRow>
      {/each} -->

      <StructuredListRow>
        <StructuredListCell>function</StructuredListCell>
        <StructuredListCell>sum</StructuredListCell>
        <StructuredListCell>sum(1, 2) should be 3</StructuredListCell>
      </StructuredListRow>
      <StructuredListRow>
        <StructuredListCell>function</StructuredListCell>
        <StructuredListCell>div</StructuredListCell>
        <StructuredListCell>div(8, 2) should be 4</StructuredListCell>
      </StructuredListRow>
      <StructuredListRow>
        <StructuredListCell>function</StructuredListCell>
        <StructuredListCell>div</StructuredListCell>
        <StructuredListCell>div(10, 3) should be 3.3333</StructuredListCell>
      </StructuredListRow>
    </StructuredListBody>
  </StructuredList>
</Tile>
