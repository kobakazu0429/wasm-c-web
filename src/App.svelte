<script>
  import { Router, Route } from "svelte-routing";
  import Index from "./pages/index.svelte";
  import Admin from "./pages/admin.svelte";
</script>

<Router>
  <Route path="/" let:location><Index {location} /></Route>
  <Route path="/admin"><Admin /></Route>
</Router>
