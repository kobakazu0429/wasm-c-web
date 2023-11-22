<script lang="ts">
  import { _ } from "svelte-i18n";
  import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
  import { boilerplate, stdin, basic, peakLoadTest, stdinTests } from "../editor/exampleCodes";
  import { setCode } from "../editor/utils";
  import { openIntroductionModal } from "./IntroductionModal/index.svelte";
  import { updateUrlParams } from "../url";
</script>

<OverflowMenu style="background-color:#6f6f6f; color: white; box-shadow: -0.0625rem 0 0 0 #161616;">
  <OverflowMenuItem
    text={$_("overflow_menu.load_boilerplate")}
    on:click={() => setCode(boilerplate)}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_simple")}
    on:click={() => {
      setCode(stdin);
      updateUrlParams({ code: stdin, tests: stdinTests });
    }}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_basic")}
    on:click={() => {
      setCode(basic);
      updateUrlParams({ code: basic, tests: undefined });
    }}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.load_peakLoadTest")}
    on:click={() => {
      setCode(peakLoadTest);
      updateUrlParams({ code: peakLoadTest, tests: undefined });
    }}
  />
  <OverflowMenuItem
    text={$_("overflow_menu.open_introduction_modal")}
    on:click={openIntroductionModal}
  />
</OverflowMenu>

<style>
  :global(.bx--overflow-menu-options) {
    width: 13rem;
  }

  :global(.bx--overflow-menu-options__btn) {
    max-width: none;
  }
</style>
