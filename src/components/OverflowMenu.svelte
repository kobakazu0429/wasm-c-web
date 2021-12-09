<script lang="ts">
  import { _ } from "svelte-i18n";
  import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
  import {
    boilerplate,
    stdin,
    basic,
    peakLoadTest,
  } from "../editor/exampleCodes";
  import { setCode } from "../editor/utils";
</script>

<OverflowMenu
  style="background-color:#6f6f6f; color: white; box-shadow: -0.0625rem 0 0 0 #161616;"
>
  <OverflowMenuItem
    text={$_("overflow_menu.load_boilerplate")}
    on:click={() => setCode(boilerplate)}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_simple")}
    on:click={() => setCode(stdin)}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_basic")}
    on:click={() => setCode(basic)}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_peakLoadTest")}
    on:click={() => setCode(peakLoadTest)}
  />
</OverflowMenu>
