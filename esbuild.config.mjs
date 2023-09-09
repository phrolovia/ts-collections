import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['index.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    minify: true,
    loader: { '.ts': 'ts' },
});
