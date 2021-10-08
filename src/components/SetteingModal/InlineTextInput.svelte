<script lang="ts">
  import { TextInput, Toggle } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import Close24 from "carbon-icons-svelte/lib/Close24";

  export let fixed: boolean = false;
  export let deleteIconVisible: boolean = false;
  export let labelText: string;
  export let value: string | /* number | */ boolean;
  export let handleRemove: (e: MouseEvent) => void;
</script>

<div class="inline">
  {#if typeof value === "string"}
    <TextInput inline {labelText} bind:value readonly={fixed} />
  <!-- {:else if typeof value === "number"} -->
  {:else if typeof value === "boolean"}
    <div class="bx--text-input__label-helper-wrapper">
      <label
        for=""
        class="bx--label bx--label--inline"
        style="margin-top: 0.8125rem;">{labelText}</label
      >
    </div>
    <Toggle bind:toggled={value} />
  {:else}
    <p>unknown</p>
  {/if}

  {#if deleteIconVisible}
    <Button
      kind="danger-ghost"
      size="small"
      hasIconOnly
      disabled={fixed}
      on:click={handleRemove}
    >
      <Close24 />
    </Button>
  {/if}
</div>

<style>
  .inline {
    display: flex;
  }

  :global(.bx--toggle__switch) {
    margin-top: 8px !important;
  }
</style>
