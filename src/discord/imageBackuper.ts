// 画像のバックアップ処理を定義するファイル

import { createConnection } from "@/mysql/dataBase"
import type { TextChannel } from "discord.js"
import type { Connection } from "mysql2/promise"

/**
 * 画像のバックアップ処理を行う関数
 * @param channel - バックアップ対象のチャンネル
 */
const imageBackuper = async ( channel: TextChannel ) =>
{
	// コネクション用の変数を用意
	let connection: Connection | undefined

	try
	{
		// コネクションの初期化
		connection = await createConnection()




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
	imageBackuper
}