<script lang="ts">
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
    text={`load "boilerplate"`}
    on:click={() => setCode(boilerplate)}
  />
  <OverflowMenuItem text={`load "simple"`} on:click={() => setCode(stdin)} />
  <OverflowMenuItem text={`load "basic"`} on:click={() => setCode(basic)} />
  <OverflowMenuItem
    text={`load "peakLoadTest"`}
    on:click={() => setCode(peakLoadTest)}
  />
</OverflowMenu>
