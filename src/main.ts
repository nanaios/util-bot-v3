// Botのメイン処理を定義するファイル

import type { Client, TextChannel } from "discord.js"
import { notNull, developLog } from "@/util"
import { getTextChannels, logChannelInfo, updateChannelInfo } from "@/discord/channel"
import type { Connection } from "mysql2/promise"
import { createConnection } from "@/mysql/dataBase"

// 環境変数を取得
const TARGET_GUILD_ID = notNull( process.env.TARGET_GUILD_ID )
const TARGET_CHANNEL_IDS = notNull( process.env.TARGET_CHANNEL_IDS ).split( "," )
developLog( `TARGET_GUILD_ID = ${ TARGET_GUILD_ID }` )
developLog( `TARGET_CHANNEL_IDS = ${ TARGET_CHANNEL_IDS }` )

// channel_infoテーブルの更新間隔
const CHANNEL_INFO_UPDATE_INTERVAL = 1000 * 60 * 60

/**
 * Botのメイン処理
 * @param client - BotのClient
 */
const main = async ( client: Client<true> ) =>
{
	// 対象サーバーの対象チャンネルを取得
	const targetGuild = await client.guilds.fetch( TARGET_GUILD_ID )
	const targetChannels = await getTextChannels( targetGuild, TARGET_CHANNEL_IDS )

	for ( const channel of targetChannels )
	{
		// チャンネルの情報を表示
		logChannelInfo( channel )

		// channel_infoテーブルの更新を定期実行するように設定
		setInterval( () => channelInfoUpdater( channel ), CHANNEL_INFO_UPDATE_INTERVAL )
	}
}

/**
 * channel_infoテーブルの更新関数
 * @param channel - 情報を更新したいチャンネル
 */
const channelInfoUpdater = async ( channel: TextChannel ) =>
{
	// コネクション用の変数を用意
	let connection: Connection | undefined
	try
	{
		// コネクションの初期化
		connection = await createConnection()

		// 更新の実行
		await updateChannelInfo( connection, channel )
	} catch ( e )
	{
		console.error( e )
	} finally
	{
		// 正常時、異常時問わずコネクションを閉じる
		if ( connection )
		{
			await connection.end()
		}
	}
}

export { main }