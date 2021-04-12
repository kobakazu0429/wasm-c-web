<script lang="ts">
  import { Tile } from "carbon-components-svelte";
  import { testResultBody, testResultOut } from "../store";

  let body = "";
  testResultBody.subscribe((_body) => {
    // body = _body.join("<br />");
    body = _body;
  });

  function sum(a: number, b: number) {
    return a + b;
  }
  const {
    core: { describe, it, expect, run },
    prettify,
    // @ts-ignore
  } = window.jestLite;

  describe("A", () => {
    describe("B", () => {
      it("sum(1, 2) should be 3", () => {
        expect(sum(1, 2)).toBe(3);
      });

      it("sum(1, -1) should be 0", () => {
        expect(sum(1, -1)).toBe(0);
      });

      describe("C", () => {
        it("sum(1, 2) should be 3", () => {
          expect(sum(1, 2)).toBe(3);
        });

        it("Error: sum(1, -1) should be 0", () => {
          expect(sum(1, -1)).toBe(1);
        });
      });
    });
  });

  (async () => {
    const result = await run();
    console.log(result);

    const newLineAlternative = "________";
    const spaceAlternative = "myspace";

    const prettty = result.map((v) => ({
      ...v,
      errors: v.errors.map((s) =>
        s
          .split("\n")
          .map((c) => c.replaceAll(/\s*at .*/g, ""))
          .filter(Boolean)
          .join(newLineAlternative)
          .replaceAll(" ", spaceAlternative)
      ),
    }));
    // console.log(JSON.stringify(a, null, 2));
    console.log(prettty);
    const html = prettify.constructResultsHTML(prettty);
    console.log(html);
    testResultOut(
      html
        .replaceAll(newLineAlternative, "<br>")
        .replaceAll(spaceAlternative, "&nbsp;")
    );
  })();
</script>

<Tile light style="width:100%; line-height: normal;">
  <div class="jest-lite-report">
    {@html body}
  </div>
</Tile>

<style>
  :global(.jest-lite-report) {
    --color-fail: #f7362b;
    --color-pass: #3dbc59;
    --spacing-tight: 0.5em;

    font: 100% Consolas, Monaco, monospace;
    box-sizing: border-box;
    line-height: 1.5em;
  }

  :global(.jest-lite-report__result) {
    margin-bottom: var(--spacing-tight);
  }

  :global(.jest-lite-report__status) {
    display: inline-block;
    padding: 0.2em 0.4em;
  }

  :global(.jest-lite-report__status-icon) {
    display: inline-block;
    width: 1em;
  }

  :global(.jest-lite-report__status--pass) {
    background: var(--color-pass);
  }

  :global(.jest-lite-report__status--fail) {
    background: var(--color-fail);
  }

  :global(.jest-lite-report__summary-status--fail) {
    color: var(--color-fail);
  }

  :global(.jest-lite-report__summary-status--pass) {
    color: var(--color-pass);
  }

  :global(.jest-lite-report__errors) {
    margin-top: var(--spacing-tight);
    padding-left: 1.5em;
    white-space: pre;
    color: var(--color-fail);
  }
</style>
