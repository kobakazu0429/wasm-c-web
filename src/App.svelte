<script lang="ts">
  import { Router, Route } from "svelte-routing";

  let Index: any;
  let Admin: any;

  import("./pages/index.svelte").then((m) => (Index = m.default));
  import("./pages/admin.svelte").then((m) => (Admin = m.default));
</script>

<Router>
  <Route path="/" let:location>
    {#if Admin}
      <svelte:component this={Index} {location} />
    {/if}
  </Route>
  <Route path="/admin">
    {#if Admin}
      <svelte:component this={Admin} />
    {/if}
  </Route>
</Router>
