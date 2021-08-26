<script lang="ts">
  import { Tile } from "carbon-components-svelte";
  import { compileLogBody } from "../store";

  let body = "";
  compileLogBody.subscribe((_body) => {
    body = _body.join("<br />");
  });
</script>

<Tile light style="width:100%; line-height: normal;">{@html body}</Tile>
