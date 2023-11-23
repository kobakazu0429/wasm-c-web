<script lang="ts">
  import * as monaco from "monaco-editor";
  import debounce from "just-debounce-it";
  import { MonacoServices } from "monaco-languageclient";
  import { editor, editorRef, monacoEditorCode } from "../store";
  import { onMount, onDestroy } from "svelte";
  import { setupFullscreenEditor } from "../editor/fullscreen";
  import { saveCodeStorage } from "../localStorage";
  import { getCode, recoveryCode } from "../editor/utils";
  import { connectLanguageServer } from "../editor/lsp";

  const willDestroyCallbacks: Array<() => void> = [];

  onDestroy(() => {
    willDestroyCallbacks.forEach((cb) => {
      cb();
    });
  });

  onMount(() => {
    setupFullscreenEditor();

    const close = connectLanguageServer();
    willDestroyCallbacks.push(() => close());

    const { code, filename } = recoveryCode();
    monacoEditorCode.update(() => code);

    monaco.languages.register({
      id: "c",
      extensions: [".c"]
    });

    const newEditor = monaco.editor.create($editorRef!, {
      language: "c",
      model: monaco.editor.createModel(code, "c", monaco.Uri.parse(`file:///${filename}`)),
      theme: "vs-dark",
      scrollbar: {
        arrowSize: 11
      },
      tabSize: 2,
      insertSpaces: true,
      fontSize: 16,
      wordWrap: "on",
      minimap: {
        enabled: false
      },
      lineNumbers: "on",
      automaticLayout: true
    });
    newEditor.onDidChangeModelContent((_event: any) => {
      const value = newEditor.getValue();
      // props.onChangeValue(value);
      monacoEditorCode.update(() => value);
    });
    editor.set(newEditor);

    const { dispose: monacoServicesDisposae } = MonacoServices.install(monaco as any);
    willDestroyCallbacks.push(() => monacoServicesDisposae());
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

    willDestroyCallbacks.push(() => {
      monaco.editor.getModels().forEach((model) => model.dispose());
    });

    const debouncedGetCode = debounce(
      () => {
        const { filename, code } = getCode();
        const { tests } = recoveryCode();
        saveCodeStorage(filename ?? "main.c", code ?? "", tests);
      },
      500,
      true
    );
    newEditor.getModel()?.onDidChangeContent(() => {
      debouncedGetCode();
    });
  });
</script>

<div id="editor" bind:this={$editorRef} />

<style>
  #editor {
    height: 100%;
  }
</style>
