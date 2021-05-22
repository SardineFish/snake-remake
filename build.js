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
        ".png": "dataurl",
        ".ttf": "file",
    },
    minify: !dev,
    sourcemap: dev,
    watch: watch,
    platform: "browser",
    define: {
        global: "window",
        DEBUG: false,
    },
    target: ["es2015"],
}

if (serve)
{
    esbuild.serve({
        host: "0.0.0.0",
        port: 8000,
        servedir: ".",
    }, options);
}
else
{
    esbuild.build(options);
}