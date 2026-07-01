import fs from "fs/promises";

interface EnvJson {
	targetGuildId: string;
	targetChannelIds: string[];
}

const readEnvJson = async (): Promise<EnvJson> => {
	const rawString = await fs.readFile("./env.json", "utf-8");
	return JSON.parse(rawString) as EnvJson;
}