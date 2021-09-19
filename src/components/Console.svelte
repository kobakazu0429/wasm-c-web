<script lang="ts" context="module">
  import "xterm/css/xterm.css";
  import { Terminal } from "xterm";
  import { FitAddon } from "xterm-addon-fit";
  import { LocalEchoAddon } from "@kobakazu0429/xterm-local-echo";
  import { Tile } from "carbon-components-svelte";
  import { consoleOut } from "../store";

  const terminal = new Terminal({
    cursorBlink: true,
    allowTransparency: true,
    theme: {
      background: "rgba(0,0,0,0)",
    },
  });
  const localEchoAddon = new LocalEchoAddon();
  terminal.loadAddon(localEchoAddon);

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  consoleOut.subscribe((s) => {
    localEchoAddon.print(s);
  });

  export async function readLine() {
    const input = (await localEchoAddon.read("")) as string;
    return input;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const terminalElement = document.getElementById("terminal");
    if (!terminalElement) return;
    terminal.open(terminalElement);
    fitAddon.fit();
  });
</script>

<Tile light style="width:100%; line-height: normal;" id="terminal" />
