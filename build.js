import esbuild from "esbuild";
import process from "process";

const dev = process.argv.includes("--dev");
const watch = process.argv.find(arg => arg === "-w" || arg === "--watch") !== undefined;
const serve = process.argv.includes("--serve");

/** @type {esbuild.BuildOptions} */
const options = {
    entryPoints: ["src/pages/index.tsx"],
    bundle: true,
    outdir: "dist",
    loader: {
        ".png": "dataurl"
    },
    minify: !dev,
    sourcemap: dev,
    watch: watch,
    platform: "browser",
}

if (serve)
{
    esbuild.serve({
        host: "localhost",
        port: 8000,
        servedir: ".",
    }, options);
}
else
{
    esbuild.build(options);
}