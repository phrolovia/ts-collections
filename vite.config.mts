import { resolve } from "path";
import { defineConfig, UserConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "./src/index.ts"),
                functions: resolve(__dirname, "./src/enumerator/functions/functions.ts"),
            },
            name: "ts-collections",
            formats: ["es"],
            fileName: (_format, entryName): string => `${entryName}.mjs`
        },
        rollupOptions: {
            external: [
                /^node:.*/ // don't bundle built-in Node.js modules (use protocol imports!)
            ],
        },
        target: 'esnext', // transpile as little as possible
    },
    plugins: [
        dts({
            entryRoot: "src",
            rollupTypes: true
        })
    ], // emit TS declaration files
} satisfies UserConfig)
