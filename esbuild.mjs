import * as esbuild from "esbuild"

await esbuild.build( {
	entryPoints: [ "src/entry.ts" ],
	bundle: true,
	outfile: "dist/entry.js",

	minify: true,
	platform: "node",
	target: "node18",
	format: "esm",
	external: [ "./node_modules/*" ],
} )