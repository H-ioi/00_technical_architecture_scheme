import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8200,
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "UniLib",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "pinia",
        "element-plus",
        "@element-plus/icons-vue",
        "axios",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          pinia: "Pinia",
          "element-plus": "ElementPlus",
          "@element-plus/icons-vue": "ElementPlusIconsVue",
          axios: "axios",
        },
      },
    },
  },
});
