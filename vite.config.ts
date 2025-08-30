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
        appDirectory: "app",
        assetsBuildDirectory: "public/build",
        publicPath: "/build/",
        serverBuildPath: "build/index.js",
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
    },
    server: {
      port: 3000,
    },
  };
});