/// <reference types="vite/client" />
/// <reference types="svelte" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv {
  VITE_COMPILER_API: string;
  VITE_METRICS_API: string;
  VITE_LSP_API: string;
}
