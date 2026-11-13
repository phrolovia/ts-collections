import { resolve } from "path";
import { defineConfig, Plugin, UserConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Wraps every top-level class of the bundle in a pure IIFE: `var X = /* @__PURE__ *\/ (() => class X {...})()`.
 *
 * Terser, the minifier behind webpack's tree-shaking, treats a computed key such as `[Symbol.iterator]`
 * as a possible side effect. When it removes an unused class it still counts everything the class body
 * refers to as used, which keeps nearly the whole library in a webpack bundle. A pure call has no side
 * effects, so every bundler can drop the class together with what only it refers to.
 */
const pureClasses = (): Plugin => ({
    name: "pure-classes",
    generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
            if (chunk.type !== "chunk") {
                continue;
            }
            const edits: { start: number; end: number; name: string | null }[] = [];
            for (const statement of this.parse(chunk.code).body) {
                if (statement.type === "ClassDeclaration") {
                    throw new Error(`pure-classes: expected classes to be emitted as variables, found "class ${statement.id?.name}"`);
                }
                if (statement.type !== "VariableDeclaration") {
                    continue;
                }
                for (const declarator of statement.declarations) {
                    if (declarator.init?.type === "ClassExpression" && declarator.id.type === "Identifier") {
                        const { start, end, id } = declarator.init as typeof declarator.init & { start: number; end: number };
                        // An anonymous class takes its name from the variable, which the wrapper would hide.
                        edits.push({ start, end, name: id ? null : declarator.id.name });
                    }
                }
            }
            let code = chunk.code;
            for (const { start, end, name } of edits.reverse()) {
                const text = code.slice(start, end);
                if (!text.startsWith("class")) {
                    throw new Error(`pure-classes: unexpected class text at ${start}: ${text.slice(0, 40)}`);
                }
                const named = name ? `class ${name}${text.slice("class".length)}` : text;
                code = `${code.slice(0, start)}/* @__PURE__ */ (() => ${named})()${code.slice(end)}`;
            }
            chunk.code = code;
        }
    }
});

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, "./src/index.ts"),
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
            bundleTypes: true
        }), // emit TS declaration files
        pureClasses()
    ],
} satisfies UserConfig)
