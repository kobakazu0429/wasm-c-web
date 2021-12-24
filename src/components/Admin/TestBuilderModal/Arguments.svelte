<script lang="ts">
  import { _ } from "svelte-i18n";
  import Argument from "./CTypeValue.svelte";
  import { argumentsValueDeleter, currentModal } from "../../../stores/admin";
</script>

<div class="arguments">
  {#each $currentModal.argumentsValues as arg, i}
    <Argument
      bind:type={arg.type}
      bind:value={arg.value}
      handleRemove={() => argumentsValueDeleter(i)}
    />
  {/each}
</div>
