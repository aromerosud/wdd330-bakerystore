import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        inventory: resolve(__dirname, "src/product_listing/index.html"),
        detail: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
  },
});
