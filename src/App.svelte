<script>
  import { Router, Route } from "svelte-routing";
  import Loadable from "svelte-loadable";
  import Index from "./pages/index.svelte";
</script>

<Router>
  <Route path="/admin" let:params>
    <Loadable loader={() => import("./pages/admin.svelte")} />
  </Route>
  <Route path="/" let:location>
    <!-- <Loadable loader={() => import("./pages/index.svelte")} {location} /> -->
      <Index {location} />
  </Route>
</Router>
