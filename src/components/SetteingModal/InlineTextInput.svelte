<script lang="ts">
  import { TextInput } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import Close24 from "carbon-icons-svelte/lib/Close24";

  export let fixed: boolean;
  export let labelText: string;
  export let value: string;
  export let handleRemove: (i: number) => void;
</script>

<div class="inline">
  <TextInput inline {labelText} bind:value readonly={fixed} />
  <Button
    kind="danger-ghost"
    size="small"
    hasIconOnly
    disabled={fixed}
    on:click={handleRemove}
  >
    <Close24 />
  </Button>
</div>

<style>
  .inline {
    display: flex;
  }
</style>
