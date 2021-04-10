<script>
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    Accordion,
    AccordionItem,
  } from "carbon-components-svelte";

  import Editor from "./components/Editor.svelte";
</script>

<Header company="IBM" platformName="Carbon Svelte">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavItem href="/" text="Build" />
    <HeaderNavItem href="/" text="Run" />
    <HeaderNavItem href="/" text="Test" />
  </HeaderNav>
</Header>

<Content style="background-color: #393939; height: calc(100% - 3rem);">
  <Grid fullWidth style="height: 100%;">
    <Row style="height: 100%; margin-bottom:3rem;">
      <Column
        style="border: 2px solid #262626; border-right: 1px solid #262626; padding:0;"
        ><Editor />
      </Column>
      <Column
        style="border: 2px solid #262626; border-left: 1px solid #262626; padding:16px;overflow-y: scroll;max-height: 100%;"
      >
        <Accordion>
          <AccordionItem>
            <div slot="title">
              <h5>Console (stdin / stdout / stderr)</h5>
            </div>
            <div>$ gcc main.c -o main</div>
          </AccordionItem>
          <AccordionItem>
            <div slot="title">
              <h5>Test Content</h5>
            </div>
            <div>sum(1,2) should be 3</div>
          </AccordionItem>
          <AccordionItem>
            <div slot="title">
              <h5>Test Result</h5>
            </div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
            <div>passed: 10, failed: 20</div>
          </AccordionItem>
        </Accordion>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  :global(body) {
    height: calc(100vh - 3rem);
  }
</style>
