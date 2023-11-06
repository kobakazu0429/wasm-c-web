/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv {
  VITE_COMPILER_API: string;
  VITE_LSP_API: string;
}
