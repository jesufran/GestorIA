import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      remix({
        serverModuleFormat: "esm",
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        ignoredRouteFiles: ["**/.*"],
        appDirectory: ".",
        buildDirectory: "public/build", // Corrected property name
      }),
      netlifyPlugin(),
      tsconfigPaths(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      }
    },
    build: {
      target: 'esnext',
      publicPath: "/build/",
      rollupOptions: {
        external: ["idb"]
      }
    },
    server: {
      port: 3000,
    },
  };
});
