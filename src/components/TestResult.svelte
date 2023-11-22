<script lang="ts">
  import { Tile } from "carbon-components-svelte";
  import { testResultBody } from "../store";

  let body = "";
  testResultBody.subscribe((_body) => {
    body = _body;
  });
</script>

<Tile light style="width:100%; line-height: normal;">
  <div class="test-report">
    {@html body}
  </div>
</Tile>

<style>
  :global(.test-report) {
    --color-fail: #f7362b;
    --color-pass: #3dbc59;
    --spacing-tight: 0.5em;

    font:
      100% Consolas,
      Monaco,
      monospace;
    color: white;
    box-sizing: border-box;
    line-height: 1.5em;
  }

  :global(.test-report__result) {
    margin-bottom: var(--spacing-tight);
  }

  :global(.test-report__status) {
    display: inline-block;
    padding: 0.2em 0.4em;
  }

  :global(.test-report__status-icon) {
    display: inline-block;
    width: 1em;
  }

  :global(.test-report__status--pass) {
    background: var(--color-pass);
  }

  :global(.test-report__status--fail) {
    background: var(--color-fail);
  }

  :global(.test-report__summary-status--fail) {
    color: var(--color-fail);
  }

  :global(.test-report__summary-status--pass) {
    color: var(--color-pass);
  }

  :global(.test-report__errors) {
    margin-top: var(--spacing-tight);
    padding-left: 1.5em;
    white-space: pre;
    color: var(--color-fail);
  }
</style>
