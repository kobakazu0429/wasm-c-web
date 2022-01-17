<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Select, SelectItem } from "carbon-components-svelte";
  import { TextInput } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import Close24 from "carbon-icons-svelte/lib/Close24";
  import { cTypes } from "../../../test/cTypes";

  export let type: string;
  export let value: string;
  export let handleRemove: ((e?: MouseEvent) => void) | undefined = undefined;
</script>

<div class="ctypeValue">
  <Select bind:selected={type} noLabel>
    {#each cTypes as t}
      <SelectItem value={t} text={t} />
    {/each}
  </Select>
  <TextInput hideLabel bind:value />
  {#if handleRemove}
    <Button kind="danger-ghost" hasIconOnly on:click={handleRemove}>
      <Close24 />
    </Button>
  {/if}
</div>

<style>
  div.ctypeValue {
    display: flex;
    align-items: flex-end;
    height: 2.5rem;
  }
  div.ctypeValue :global(div.bx--form-item:first-child) {
    width: 170px;
    flex: inherit;
  }
  div.ctypeValue :global(div.bx--text-input-wrapper) {
    margin-left: 10px;
  }
  div.ctypeValue :global(.bx--btn--danger-ghost) {
    min-height: 2.5rem;
    max-height: 2.5rem;
  }
</style>
