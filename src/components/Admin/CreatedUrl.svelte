<script lang="ts">
  import { Button, TextInput, CopyButton } from "carbon-components-svelte";
  import { escapeCode, getCode } from "../../editor/utils";
  import { compressLzString } from "../../compression";
  import { buildUrlParams } from "../../url";
  import { get } from "svelte/store";
  import { buildingTests } from "../../stores/admin";
  import { testsSchemaStrip, testForModalToTestConverter } from "../../test";

  let url = "";

  export const create = () => {
    const obj: any = {};
    const { code } = getCode();
    if (code) obj.code = escapeCode(code);
    const originalTests = Array.from(get(buildingTests).values());
    const tests = originalTests.map(testForModalToTestConverter);

    if (tests) {
      try {
        const stripedTests = testsSchemaStrip.parse(tests);
        obj.tests = stripedTests;
      } catch (error) {
        console.log(error);
      }
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
