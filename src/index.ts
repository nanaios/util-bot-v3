import { readEnvJson } from "./EnvJson";

const main = async () => {
	console.log("Hello, World!");

	const envJson = await readEnvJson();
	console.log(envJson);
}


main();