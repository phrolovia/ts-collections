import {resolve} from "path";
import {defineConfig, UserConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "./src/index.ts"),
            name: "ts-collections",
            formats: ["es"],
            fileName: 'index',
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
            insertTypesEntry: true,
        })
    ], // emit TS declaration files
} satisfies UserConfig)