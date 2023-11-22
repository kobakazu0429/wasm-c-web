<script lang="ts" context="module">
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { Tile } from "carbon-components-svelte";

  import "xterm/css/xterm.css";
  import { consoleOut } from "../../store";
  import { localEchoAddon, fitAddon } from "./terminal";

  onMount(async () => {
    const terminalElement = document.getElementById("terminal");
    if (!terminalElement) return;
    const { Terminal } = await import("xterm");
    const terminal = new Terminal({
      cursorBlink: true,
      allowTransparency: true,
      theme: {
        background: "rgba(0,0,0,0)"
      }
    });
    terminal.loadAddon(localEchoAddon);
    terminal.loadAddon(fitAddon);
    terminal.open(terminalElement);
    fitAddon.fit();

    consoleOut.subscribe((s) => {
      localEchoAddon.print(s);
    });
  });
</script>

<Tile light style="width:100%; line-height: normal; height: 300px;" id="terminal" />

<style>
  :global(#terminal > div, #terminal > div > div, #terminal canvas) {
    height: 100% !important;
    width: 100% !important;
  }

  :global(#terminal .xterm-viewport) {
    z-index: 10;
  }
</style>
