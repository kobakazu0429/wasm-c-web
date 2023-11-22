<script lang="ts">
  import { TextInput } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";

  export let key: string;
  export let value: string;
  export let handleRemove: (e: MouseEvent) => void;
</script>

<div class="inline">
  <TextInput bind:value={key} placeholder="key" />
  <TextInput bind:value placeholder="value" />
  <Button kind="danger-ghost" size="small" icon={Close} on:click={handleRemove} />
</div>

<style>
  .inline {
    display: flex;
  }

  .inline > :global(div:first-child) {
    width: 140px;
    margin-right: 20px;
    flex: initial;
  }
</style>
