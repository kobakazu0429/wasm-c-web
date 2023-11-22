<script lang="ts">
  import { _ } from "svelte-i18n";
  import { TextInput, FormGroup } from "carbon-components-svelte";
  import { decompressLzString } from "../../compression";
  import { formatCode, setCode } from "../../editor/utils";
  import { buildingTestsAdder, buildingTestsAllDelete } from "../../stores/admin";
  import { testsSchema, TestToTestForModalConverter } from "../../test";

  export let url = "";

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
      try {
        testsSchema.parse(tests);
        tests.forEach((test: any) => {
          buildingTestsAdder(TestToTestForModalConverter(test));
        });
      } catch (error) {
        console.log(error);
      }
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
