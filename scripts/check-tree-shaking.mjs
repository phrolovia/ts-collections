// Checks that a bundle importing part of the library leaves the rest out, and that the bundles still run.
// Run after `npm run build`.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "vite";

const dist = resolve(import.meta.dirname, "../dist/index.mjs").replace(/\\/g, "/");

const cases = [
    {
        name: "a utility",
        code: `import { swap } from "${dist}"; const a = [1, 2]; swap(a, 0, 1); export default a.join();`,
        expected: "2,1",
        maxBytes: 1_000
    },
    {
        name: "an exception",
        code: `import { CycleDetectedException } from "${dist}"; export default new CycleDetectedException([1, 2, 1]) instanceof Error;`,
        expected: true,
        maxBytes: 1_000
    },
    {
        // Collections reach every collection that their conversion methods create, but not the rest.
        name: "one collection",
        code: `import { List } from "${dist}"; export default new List([3, 1, 2]).orderBy(x => x).toSortedSet().groupBy(x => x % 2).count();`,
        expected: 2,
        maxShareOfEverything: 0.75
    },
    {
        name: "everything",
        code: `import * as library from "${dist}"; export { library }; export default Object.keys(library).length > 100;`,
        expected: true
    }
];

const bundle = async code => {
    const consumer = {
        name: "consumer",
        resolveId: id => id === "consumer" ? "\0consumer" : null,
        load: id => id === "\0consumer" ? code : null
    };
    const output = await build({
        configFile: false,
        logLevel: "silent",
        plugins: [consumer],
        build: { write: false, minify: true, rollupOptions: { input: "consumer", preserveEntrySignatures: "strict", output: { format: "es" } } }
    });
    return (Array.isArray(output) ? output[0] : output).output[0].code;
};

const failures = [];

// Terser, which webpack uses to drop unused code, needs every class wrapped by the pure-classes plugin.
const bareClasses = readFileSync(dist, "utf8").match(/=\s*class\b/g)?.length ?? 0;
if (bareClasses > 0) {
    failures.push(`dist/index.mjs has ${bareClasses} classes that are not wrapped in a pure IIFE`);
}

const sizes = {};
for (const { name, code, expected } of cases) {
    const output = await bundle(code);
    sizes[name] = output.length;
    const { default: actual } = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
    if (actual !== expected) {
        failures.push(`${name}: the bundle returned ${JSON.stringify(actual)} instead of ${JSON.stringify(expected)}`);
    }
}
for (const { name, maxBytes, maxShareOfEverything } of cases) {
    const share = sizes[name] / sizes.everything;
    console.log(`${name.padEnd(16)} ${(sizes[name] / 1024).toFixed(1).padStart(6)} kB  ${(share * 100).toFixed(0).padStart(3)}% of everything`);
    if (maxBytes !== undefined && sizes[name] > maxBytes) {
        failures.push(`${name}: ${sizes[name]} bytes, expected at most ${maxBytes}`);
    }
    if (maxShareOfEverything !== undefined && share > maxShareOfEverything) {
        failures.push(`${name}: ${(share * 100).toFixed(0)}% of the full bundle, expected at most ${maxShareOfEverything * 100}%`);
    }
}

if (failures.length > 0) {
    console.error(`\nTree-shaking check failed:\n- ${failures.join("\n- ")}`);
    process.exit(1);
}
