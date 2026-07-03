// Botのメイン処理を定義するファイル

import type { Client } from "discord.js"
import { notNull, developLog } from "./util"
import { getTextChannels, logChannelInfo } from "./discord/channel"

// 環境変数を取得
const TARGET_GUILD_ID = notNull( process.env.TARGET_GUILD_ID )
const TARGET_CHANNEL_IDS = notNull( process.env.TARGET_CHANNEL_IDS ).split( "," )

developLog( `TARGET_GUILD_ID = ${ TARGET_GUILD_ID }` )
developLog( `TARGET_CHANNEL_IDS = ${ TARGET_CHANNEL_IDS }` )

// Botのメイン処理
const main = async ( client: Client<true> ) =>
{
	// 対象サーバーの対象チャンネルを取得
	const targetGuild = await client.guilds.fetch( TARGET_GUILD_ID )
	const targetChannels = await getTextChannels( targetGuild, TARGET_CHANNEL_IDS )

	// チャンネルの情報を表示
	for ( const channel of targetChannels ) logChannelInfo( channel )
}

export { main }