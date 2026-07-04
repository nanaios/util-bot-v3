// channel_infoの更新処理を定義するファイル

import { createConnection } from "@/mysql/dataBase"
import type { TextChannel } from "discord.js"
import type { Connection } from "mysql2/promise"
import { findFirstMessageId } from "@/discord/message"
import { CHANNEL_INFO_TABLE_NAME, executeInsertChannelInfo, executeSelectChannelInfo, executeUpdateChannelInfo } from "@/mysql/query"

/**
 * channel_infoテーブルの情報を更新する関数
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

		// チャンネルの最初のメッセージのidを取得
		const firstMessageId = await findFirstMessageId( channel )

		// infoを取得
		const info = await executeSelectChannelInfo( connection, channel )

		// infoの存在で分岐
		// infoが存在すればupdateを、存在しなければinsertを行う
		if ( info.length === 0 )
		{
			console.log( `There are not channel[id: ${ channel.id }] info in ${ CHANNEL_INFO_TABLE_NAME } table.` )
			console.log( `Insert channel[id: ${ channel.id }] info.` )

			// 挿入を実行
			await executeInsertChannelInfo( connection, channel, firstMessageId )

		}
		else
		{
			console.log( `There are channel[id: ${ channel.id }] info in ${ CHANNEL_INFO_TABLE_NAME } table.` )
			console.log( `Update channel[id: ${ channel.id }] info.` )

			// 更新を実行
			await executeUpdateChannelInfo( connection, channel, firstMessageId )
		}

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

export
{
	channelInfoUpdater
}