<script lang="ts">
  import loader from "@monaco-editor/loader";

  loader.config({ "vs/nls": { availableLanguages: { "*": "ja" } } });
  loader.init().then((monaco) => {
    const newEditor = monaco.editor.create(document.querySelector("#editor")!, {
      value:
        '#include <stdio.h>\n\nint main() {\n  printf("Hello, World !\\n");\n}',
      language: "c",
      theme: "vs-dark",
      scrollbar: {
        arrowSize: 11,
      },
      fontSize: 16,
      wordWrap: "on",
      minimap: {
        enabled: false,
      },
      lineNumbers: "on",
    });
    newEditor.updateOptions({ tabSize: 2 });
    newEditor.onDidChangeModelContent((_event: any) => {
      const value = newEditor.getValue();
      // props.onChangeValue(value);
    });
    // console.log(monaco.languages.getLanguages());
    // @ts-ignore
    // console.log(newEditor._themeService._knownThemes);
    // monaco.editor.defineTheme("One Dark Pro")
    // const rect = editorRef.current.getBoundingClientRect();
    // newEditor.layout({ width: rect.width, height: rect.height });
    // props.focusWithDidMount && newEditor.focus();

    // return () => {
    //   // const p = newEditor.getPosition();
    //   // const offset = newEditor.getOffsetForColumn(p.lineNumber, p.column);
    //   newEditor.dispose();
    // };
  });
</script>

<div id="editor" />

<style>
  #editor {
    height: 100%;
  }
</style>
