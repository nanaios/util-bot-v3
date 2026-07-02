import * as esbuild from "esbuild"

await esbuild.build( {
	entryPoints: [ "src/index.ts" ],
	bundle: true,
	outfile: "dist/index.js",

	minify: true,
	platform: "node",
	target: "node18",
	format: "esm",
	external: [ "./node_modules/*" ],
} )