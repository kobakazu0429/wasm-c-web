<script lang="ts">
  import { Button, TextInput, CopyButton } from "carbon-components-svelte";
  import { escapeCode, getCode } from "../../editor/utils";
  import { compressLzString } from "../../compression";
  import { buildUrlParams } from "../../url";
  import { get } from "svelte/store";
  import { buildingTestsToArray } from "../../stores/admin";
  import { testsSchema } from "../../jest";
  import type { Tests } from "../../jest";
  import type { Row } from "./TestsBuildTable/table";
  let url = "";

  const converter = (row: Row): Tests[0] => {
    const content = new RegExp(/^\[(.+)\]$/).exec(
      row.arguments as string
    ) as any;
    const input = content[1].split(",").map(Number);

    return {
      name: row.name,
      functionName: row.functionName,
      input,
      expect: Number(row.returnValue),
    };
  };

  export const create = () => {
    const obj: any = {};
    const { code } = getCode();
    if (code) obj.code = escapeCode(code);

    const originalTests = get(buildingTestsToArray);
    const tests = originalTests.map(converter);

    try {
      testsSchema.parse(tests);
      if (tests) obj.tests = tests;
    } catch (error) {
      console.log(error);
    }

    const params = compressLzString(JSON.stringify(obj));
    url = location.origin + buildUrlParams([["data", params]]);
  };
</script>

<div class="wrapper">
  <Button kind="secondary" on:click={create}>生成する</Button>
  <TextInput readonly bind:value={url} />
  <CopyButton bind:text={url} />
</div>

<style>
  .wrapper {
    margin-top: 20px;
    display: flex;
    height: 40px;
  }

  :global(.wrapper > button) {
    min-height: 40px;
  }
</style>
