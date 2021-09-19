<script lang="ts" context="module">
  import { writable } from "svelte/store";
  import { Modal } from "carbon-components-svelte";
  const modalOpenStatus = writable(false);
  export const openSettingModal = () => {
    console.log("open");
    modalOpenStatus.set(true);
  };
</script>

<Modal
  bind:open={$modalOpenStatus}
  modalHeading="Create database"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => {}}
  on:open
  on:close
  on:submit
>
  <p>Create a new Cloudant database in the US South region.</p>
</Modal>
