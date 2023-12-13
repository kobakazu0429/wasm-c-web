<script lang="ts">
  import * as monaco from "monaco-editor";
  import debounce from "just-debounce-it";
  import { MonacoServices } from "monaco-languageclient";
  import { editor, editorRef, monacoEditorCode, settings } from "../store";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { setupFullscreenEditor } from "../editor/fullscreen";
  import { getUser, saveCodeStorage } from "../localStorage";
  import { getCode, recoveryCode } from "../editor/utils";
  import { connectLanguageServer } from "../editor/lsp";

  const ws = writable(connectLanguageServer(getUser().id));

  settings.subscribe(async (s) => {
    const userId = s.config.find((c) => c.key === "User ID");
    if (userId && typeof userId.value === "string" && userId.value !== "__IGNORE_ME__") {
      await $ws();
      ws.set(connectLanguageServer(userId.value));
    }
  });

  const willDestroyCallbacks: Array<() => void> = [];

  onDestroy(async () => {
    willDestroyCallbacks.forEach((cb) => {
      cb();
    });
    await $ws();
  });

  onMount(() => {
    setupFullscreenEditor();

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
