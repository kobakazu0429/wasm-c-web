<script lang="ts" context="module">
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { Tile } from "carbon-components-svelte";

  import "xterm/css/xterm.css";
  import { Terminal } from "xterm";
  import { consoleOut } from "../../store";
  import { localEchoAddon, fitAddon } from "./terminal";

  const terminal = new Terminal({
    cursorBlink: true,
    allowTransparency: true,
    theme: {
      background: "rgba(0,0,0,0)",
    },
  });
  terminal.loadAddon(localEchoAddon);
  terminal.loadAddon(fitAddon);

  consoleOut.subscribe((s) => {
    localEchoAddon.print(s);
  });

  onMount(() => {
    const terminalElement = document.getElementById("terminal");
    if (!terminalElement) return;
    terminal.open(terminalElement);
    fitAddon.fit();
  });
</script>

<Tile light style="width:100%; line-height: normal;" id="terminal" />
