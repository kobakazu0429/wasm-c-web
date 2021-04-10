<script lang="ts">
  import { Tile } from "carbon-components-svelte";
  import { consoleBody } from "../store";

  let body = "";
  consoleBody.subscribe((_body) => {
    body = _body.join("<br />");
  });
</script>

<Tile light style="width:100%; line-height: normal;">{@html body}</Tile>
