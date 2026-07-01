import { Client, GatewayIntentBits } from "discord.js";
import { readEnvJson } from "./EnvJson";

const env = await readEnvJson();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.once("clientReady", (client) => {
	console.log(`Bot ${client.user.displayName} is ready!`);
});

client.login(env.loginToken);