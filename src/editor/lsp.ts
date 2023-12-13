import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  type MessageTransports
} from "monaco-languageclient";
import normalizeUrl from "normalize-url";
import ReconnectingWebSocket, {
  type Options as ReconnectingWebSocketOptions
} from "reconnecting-websocket";

export const connectLanguageServer = (userId?: string) => {
  const url = normalizeUrl(
    import.meta.env.VITE_LSP_API + (userId ? `/?userId=${encodeURIComponent(userId!)}` : "")
  );
  let languageClient: MonacoLanguageClient | undefined;
  const webSocket = createWebSocket(url);
  webSocket.onopen = async () => {
    const socket = toSocket(webSocket as any);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    languageClient = createLanguageClient({
      reader,
      writer
    });
    languageClient.start();
    reader.onClose(async () => languageClient && (await languageClient.stop()));
  };

  return async () => {
    if (languageClient) {
      await languageClient.stop(5000);
    }
    webSocket.close();
  };
};

const createLanguageClient = (transports: MessageTransports): MonacoLanguageClient => {
  return new MonacoLanguageClient({
    name: "Sample Language Client",
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ["c"],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart })
      }
    },
    connectionProvider: {
      get(_encoding) {
        return Promise.resolve(transports);
      }
    }
  });
};

const createWebSocket = (url: string): ReconnectingWebSocket => {
  const socketOptions: ReconnectingWebSocketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false
  };
  return new ReconnectingWebSocket(url, [], socketOptions);
};
