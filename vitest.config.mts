// vitest.config.mts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8', // or 'v8'
        },
        globals: true,
        reporters: ["html"]
    },
})