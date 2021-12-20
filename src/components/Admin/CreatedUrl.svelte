<script lang="ts">
  import { Button, TextInput, CopyButton } from "carbon-components-svelte";
  import { escapeCode, getCode } from "../../editor/utils";
  import { compressLzString } from "../../compression";
  import { buildUrlParams } from "../../url";
  import { get } from "svelte/store";
  import { buildingTestsToArray } from "../../stores/admin";
  import { testsSchema } from "../../jest";
  import type { Test, TestForModal } from "../../jest";
  let url = "";

  const converter = (test: TestForModal): Test => {
    const content = new RegExp(/^\[(.+)\]$/).exec(
      test.argumentsValue as string
    ) as any;
    const argumentsValue = content[1].split(",").map(Number);

    return {
      id: test.id,
      testName: test.testName,
      functionName: test.functionName,
      argumentsValue,
      returnValue: test.returnValue ? Number(test.returnValue) : null,
      returnPrecision: test.returnPrecision
        ? Number(test.returnPrecision)
        : null,
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
