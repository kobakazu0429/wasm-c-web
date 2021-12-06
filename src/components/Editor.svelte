<script lang="ts">
  import { ulid } from "ulid";
  import loader from "@monaco-editor/loader";
  import { listen } from "@codingame/monaco-jsonrpc";
  import {
    MonacoLanguageClient,
    MessageConnection,
    CloseAction,
    ErrorAction,
    MonacoServices,
    createConnection,
  } from "@codingame/monaco-languageclient";
  import normalizeUrl from "normalize-url";
  import ReconnectingWebSocket from "reconnecting-websocket";
  import type { Options as ReconnectingWebSocketOptions } from "reconnecting-websocket";
  import { editor, editorRef, monacoEditorCode } from "../store";
  import { onMount, onDestroy } from "svelte";
  import { setupFullscreenEditor } from "../editor/fullscreen";
  import { stdin as initValue } from "../editor/exampleCodes";

  loader.config({ "vs/nls": { availableLanguages: { "*": "ja" } } });

  monacoEditorCode.update(() => initValue);

  loader.init().then((monaco) => {
    // register Monaco languages
    monaco.languages.register({
      id: "c",
      extensions: [".c"],
    });
    const newEditor = monaco.editor.create(document.querySelector("#editor")!, {
      language: "c",
      model: monaco.editor.createModel(
        initValue,
        "c",
        monaco.Uri.parse(`file:///${ulid()}.c`)
      ),
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
      automaticLayout: true,
    });
    newEditor.updateOptions({ tabSize: 2 });
    newEditor.onDidChangeModelContent((_event: any) => {
      const value = newEditor.getValue();
      // props.onChangeValue(value);
      monacoEditorCode.update(() => value);
    });
    editor.set(newEditor);
    MonacoServices.install(monaco);
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

    const url = createUrl("/lsp");
    const webSocket = createWebSocket(url);
    // listen when the web socket is opened
    listen({
      webSocket: webSocket as any,
      onConnection: (connection: any) => {
        // create and start the language client
        const languageClient = createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
      },
    });

    function createLanguageClient(
      connection: MessageConnection
    ): MonacoLanguageClient {
      return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
          // use a language id as a document selector
          documentSelector: ["c"],
          // disable the default error handler
          errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart,
          },
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
          get: (errorHandler, closeHandler) => {
            return Promise.resolve(
              createConnection(connection, errorHandler, closeHandler)
            );
          },
        },
      });
    }

    function createUrl(path: string): string {
      const protocol = location.protocol === "https:" ? "wss" : "ws";
      return normalizeUrl(
        `${protocol}://${import.meta.env.VITE_API_SERVER_DOMAIN}/${
          location.pathname
        }${path}`
      );
    }

    function createWebSocket(url: string) {
      const socketOptions: ReconnectingWebSocketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false,
      };
      return new ReconnectingWebSocket(url, [], socketOptions);
    }

    willDestroyCallbacks.push(() => {
      monaco.editor.getModels().forEach((model) => model.dispose());
    });
  });

  let willDestroyCallbacks: any[] = [];

  onDestroy(() => {
    willDestroyCallbacks.forEach((cb) => {
      cb();
    });
  });

  onMount(() => {
    setupFullscreenEditor();
  });
</script>

<div id="editor" bind:this={$editorRef} />

<style>
  #editor {
    height: 100%;
  }
</style>
