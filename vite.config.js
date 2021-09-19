import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  build: {
    target: "es2019",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
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
      preprocess: sveltePreprocess(),
    }),
  ],
});
