<script lang="ts">
  import { _ } from "svelte-i18n";
  import { TextInput, FormGroup } from "carbon-components-svelte";
  import { decompressLzString } from "../../compression";
  import { formatCode, setCode } from "../../editor/utils";
  import {
    buildingTestsAdder,
    buildingTestsAllDelete,
  } from "../../stores/admin";
  import { ulid } from "ulid";

  export let url = "";

  // const converter = (test: Tests[0]):Omit<Row,"id"|"returnPrecision">  => {
  const converter = (test: any): any => {
    return {
      id: ulid(),
      testName: test.name,
      functionName: test.functionName,
      argumentsValue: `[${test.input.join(",")}]`,
      returnValue: String(test.expect),
      returnPrecision: "",
    };
  };

  const recovery = (url: string) => {
    const match = url.match(/^https?:\/\/.+\/?data=(.+)$/);
    if (!match || !match[1]) return;
    const lz = match[1];

    const decompressedLz = decompressLzString(lz);
    if (decompressedLz === "") return;
    const { code, tests } = JSON.parse(decompressedLz);

    if (code) setCode(code);
    formatCode();

    if (tests) {
      tests.forEach((test: any) => {
        buildingTestsAdder(converter(test));
      });
    }
  };

  const clearAll = () => {
    setCode("");
    buildingTestsAllDelete();
  };

  $: {
    if (url === "") {
      clearAll();
    } else {
      recovery(url);
    }
  }
</script>

<FormGroup>
  <TextInput
    labelText={$_("admin.form.recovery_from_url.label_text")}
    helperText={$_("admin.form.recovery_from_url.helper_text")}
    placeholder={$_("admin.form.recovery_from_url.placeholder")}
    bind:value={url}
  />
</FormGroup>
