<script lang="ts">
  import { TextInput } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import Close24 from "carbon-icons-svelte/lib/Close24";

  export let group: Recode<string, string>;
  export let key: string;
  export let value: string;
  export let handleRemove: (i: number) => void;
</script>

<div class="inline">
  <TextInput bind:group bind:value={key} placeholder="key" />
  <TextInput bind:group bind:value placeholder="value" />
  <Button kind="danger-ghost" size="small" hasIconOnly on:click={handleRemove}>
    <Close24 />
  </Button>
</div>

<style>
  .inline {
    display: flex;
  }

  :global(.inline > div:first-child) {
    width: 140px;
    margin-right: 20px;
    flex: initial;
  }
</style>
