// Botのメイン処理を定義するファイル

import type { Client } from "discord.js"
import { notNull, devLog } from "./util"
import { getTextChannels } from "./discord/channel"

// 環境変数を取得
const TARGET_GUILD_ID = notNull( process.env.TARGET_GUILD_ID )
const TARGET_CHANNEL_IDS = notNull( process.env.TARGET_CHANNEL_IDS ).split( "," )

devLog( `TARGET_GUILD_ID = ${ TARGET_GUILD_ID }` )
devLog( `TARGET_CHANNEL_IDS = ${ TARGET_CHANNEL_IDS }` )

// Botのメイン処理
const main = async ( client: Client<true> ) =>
{
	// 対象ギルドの対象チャンネルを取得
	const targetGuild = await client.guilds.fetch( TARGET_GUILD_ID )
	const targetChannels = await getTextChannels( targetGuild, TARGET_CHANNEL_IDS )
}

export { main }