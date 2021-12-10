<script lang="ts">
  import "xterm/css/xterm.css";
  import { Terminal } from "xterm";
  import { FitAddon } from "xterm-addon-fit";
  import { onMount } from "svelte";
  import { Tile } from "carbon-components-svelte";
  import { compileLog } from "../store";

  const terminal = new Terminal({
    cursorBlink: false,
    allowTransparency: true,
    theme: {
      background: "rgba(0,0,0,0)",
      cursor: "rgba(0,0,0,0)",
    },
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  compileLog.subscribe((s) => {
    s.split("\n").forEach((c, i) => {
      if (i !== 0) c = " ".repeat(15) + c;
      terminal.writeln(c);
    });
  });

  onMount(() => {
    const terminalElement = document.getElementById("compile-log");
    if (!terminalElement) return;
    terminal.open(terminalElement);
    fitAddon.fit();
  });
</script>

<Tile
  light
  style="width:100%; line-height: normal; height: 150px"
  id="compile-log"
/>

<style>
  :global(#compile-log > div, #compile-log > div > div, #compile-log canvas) {
    height: 100% !important;
    width: 100% !important;
  }
</style>
