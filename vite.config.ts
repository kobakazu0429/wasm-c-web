import { defineConfig, type PluginOption } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { optimizeImports, optimizeCss } from "carbon-preprocess-svelte";
// import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/compile": {
        target:
          mode === "production"
            ? "https://compiler.kaz.dev"
            : "http://localhost:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/compile/, ""),
      },
      "/lsp": {
        target:
          mode === "production" ? "wss://lsp.kaz.dev" : "ws://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lsp/, ""),
      },
    },
  },

  build: {
    target: "es2019",
    rollupOptions: {
      strictDeprecations: true,
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
    minify: mode === "production",
  },

  // css: {
  //   postCss: {
  //     plugins: [autoprefixer],
  //   },
  // },

  plugins: [
    mode === "production" &&
      (visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption),

    svelte({
      emitCss: false,
      preprocess: [sveltePreprocess(), optimizeImports()],
    }),

    mode === "production" &&
      (optimizeCss({ safelist: { greedy: [/xterm/] } }) as PluginOption),
  ],
}));
