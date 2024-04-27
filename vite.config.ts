// vite.config.js
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: './index.ts',
            formats: ['es'], // pure ESM package
            fileName: 'index',
        },
        rollupOptions: {
            external: [
                /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
            ],
        },
        target: 'esnext', // transpile as little as possible
    },
    plugins: [dts()], // emit TS declaration files
})