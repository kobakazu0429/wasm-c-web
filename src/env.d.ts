/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_SERVER_URL: string;
  readonly VITE_API_SERVER_DOMAIN: string;
}
