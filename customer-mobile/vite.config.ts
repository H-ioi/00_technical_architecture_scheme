import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [uni()],
    server: {
      host: true,
      port: 5212,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8094",
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  };
});
