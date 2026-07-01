import fs from "fs/promises";

/**
 * 今回のプロジェクトで使用する*.env.jsonの型定義
 */
interface EnvJson {
	loginToken: string;
	targetGuildId: string;
	targetChannelIds: string[];
}

/**
 * *.env.jsonを読み込む関数
 * @param path string - 読み込む*.env.jsonのパス。デフォルトは"./env.json"
 * @return Promise<EnvJson> - 読み込んだ*.env.jsonの内容
 */
const readEnvJson = async (path = "./.env.json"): Promise<EnvJson> => {
	const rawString = await fs.readFile(path, "utf-8");
	return JSON.parse(rawString) as EnvJson;
}

export { readEnvJson, EnvJson };