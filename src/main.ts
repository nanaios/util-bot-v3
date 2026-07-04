// Botのメイン処理を定義するファイル

import type { Client } from "discord.js"
import { notNull, developLog } from "@/util"
import { getTextChannels, logChannelInfo } from "@/discord/channel"
import { channelInfoUpdater } from "@/discord/channelInfoUpdater"
import { setTimeout } from "timers/promises"
import { imageBackuper } from "@/discord/imageBackuper"

// 環境変数を取得
const TARGET_GUILD_ID = notNull( process.env.TARGET_GUILD_ID )
const TARGET_CHANNEL_IDS = notNull( process.env.TARGET_CHANNEL_IDS ).split( "," )
developLog( `TARGET_GUILD_ID = ${ TARGET_GUILD_ID }` )
developLog( `TARGET_CHANNEL_IDS = ${ TARGET_CHANNEL_IDS }` )

// 実行間隔の定義
const IMAGE_BACKUP_INTERVAL = 1000 * 60 * 10
const CHANNEL_INFO_UPDATE_INTERVAL = 1000 * 60 * 60
developLog( `IMAGE_BACKUP_INTERVAL = ${ IMAGE_BACKUP_INTERVAL }` )
developLog( `CHANNEL_INFO_UPDATE_INTERVAL = ${ CHANNEL_INFO_UPDATE_INTERVAL }` )

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

	// バックアップ処理
	while ( true )
	{
		for ( const channel of targetChannels )
		{
			imageBackuper( channel )
		}

		// 指定時間待機し、負荷を軽減
		await setTimeout( IMAGE_BACKUP_INTERVAL )
	}
}

export
{
	main
}