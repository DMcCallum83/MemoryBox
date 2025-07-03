import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { GOOGLE_CLIENT_ID } from "./src/config/auth";
import fs from "fs";
import path from "path";

// Plugin to replace placeholders in manifest.json
const replaceManifestPlaceholders = () => {
  return {
    name: "replace-manifest-placeholders",
    writeBundle() {
      const manifestPath = path.resolve("dist/manifest.json");
      if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, "utf8");
        manifestContent = manifestContent.replace(
          "GOOGLE_CLIENT_ID_PLACEHOLDER",
          GOOGLE_CLIENT_ID
        );
        fs.writeFileSync(manifestPath, manifestContent);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "index.html",
          dest: ".",
        },
        {
          src: "public/*",
          dest: ".",
        },
        {
          src: "manifest.json",
          dest: ".",
        },
      ],
    }),
    replaceManifestPlaceholders(),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
        entryFileNames: "[name].js",
      },
      input: {
        main: "src/main.tsx",
        background: "src/background.ts",
      },
    },
  },
});
