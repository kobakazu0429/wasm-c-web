import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { optimizeImports, optimizeCss } from "carbon-preprocess-svelte";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig(({ mode }) => ({
  build: {
    target: "es2019",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      plugins: [
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
    minify: mode === "production"
  },

  resolve: {
    alias: {
      vscode: require.resolve(
        "@codingame/monaco-languageclient/lib/vscode-compatibility"
      ),
    },
  },

  css: {
    postCss: {
      plugins: [autoprefixer()],
    },
  },

  plugins: [
    svelte({
      emitCss: false,
      preprocess: [sveltePreprocess(), optimizeImports()],
    }),
    mode === "production" && optimizeCss({ safelist: { greedy: [/xterm/] } })
  ],
}));
