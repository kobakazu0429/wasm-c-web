<script lang="ts" context="module">
  export type RawBody =
    | [type: "list" | "list-right", ...content: [string, string]]
    | [type: "link", url: "string", content: string]
    | [type: "br"];
</script>

<script lang="ts">
  import { OutboundLink } from "carbon-components-svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";

  export let body: RawBody[];
</script>

<Grid fullWidth>
  {#each body as [type, ...props]}
    {#if type === "link"}
      <Row>
        <Column>
          <OutboundLink href={props[0]}>{props[1]}</OutboundLink>
        </Column>
      </Row>
    {:else if type === "list"}
      <Row>
        {#each props as prop}
          <Column>{prop}</Column>
        {/each}
      </Row>
    {:else if type === "list-right"}
      <Row>
        {#each props as prop}
          <Column style="text-align:right;">{prop}</Column>
        {/each}
      </Row>
    {:else if type === "br"}
      <br />
    {:else}
      <Row>{props[0]}</Row>
    {/if}
  {/each}
</Grid>
