<script>
  import { Router, Route } from "svelte-routing";
  import Index from "./pages/index.svelte";
</script>

<Router>
  <Route path="/" let:location><Index {location} /></Route>
</Router>
