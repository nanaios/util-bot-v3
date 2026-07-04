// 画像のバックアップ処理を定義するファイル

import { createDownloadFileInfos, createDownloadFolder, downloadFile } from "@/file/download"
import { createConnection } from "@/mysql/dataBase"
import { executeInsertBackupProgress, executeSelectBackupProgress, executeUpdateBackupProgress } from "@/mysql/query"
import { developLog } from "@/util"
import type { TextChannel } from "discord.js"
import type { Connection } from "mysql2/promise"
import path from "path"
import fs from "fs/promises"

/**
 * 画像のバックアップ処理を行う関数
 * @param channel - バックアップ対象のチャンネル
 */
const backupImage = async ( channel: TextChannel ) =>
{
	console.group( "backup image func" )
	console.log( `start backup image in channel ${ channel.name } [id: ${ channel.id }]` )

	// コネクション用の変数を用意
	let connection: Connection | undefined

	try
	{
		// コネクションの初期化
		connection = await createConnection()

		// 現在のバックアップ進捗を取得
		const backupProgress = await executeSelectBackupProgress( connection, channel )
		developLog( backupProgress )

		// 最後にバックアップされたメッセージのidを格納するための変数を用意
		let lastBackupMessageId: string

		// 現在のバックアップ進捗が取得出来たら変数に格納、取得できない場合はレコードの挿入を行う
		if ( backupProgress.length === 0 )
		{
			// 挿入を実行
			// discord apiの仕様上、メッセージのidは0より大きいのでこの後の処理で使用しやすいよう0を挿入する
			executeInsertBackupProgress( connection, channel, 0 )

			// 変数もレコードに合わせて更新
			lastBackupMessageId = "0"
		} else
		{
			lastBackupMessageId = backupProgress[ 0 ].last_backup_message_id.toString()
		}
		developLog( `lastBackupMessageId = ${ lastBackupMessageId }` )

		// ダウンロード先のフォルダを作成
		const downloadFolderPath = await createDownloadFolder( channel )

		// 画像のバックアップを行う
		while ( true )
		{
			// 次のメッセージを取得する
			const messages = await channel.messages.fetch( {
				cache: false,
				after: lastBackupMessageId,
				limit: 5
			} )

			// メッセージが存在しなければ終了
			if ( messages.size === 0 )
			{
				break
			}

			// 画像を取得しバックアップを行う
			for ( const [ id, message ] of messages )
			{
				console.log( `message id: ${ id }` )

				// ダウンロードに必要な情報を作成
				const infos = createDownloadFileInfos( message )
				developLog( infos )

				for ( const info of infos )
				{
					// ファイルを取得
					const buffer = await downloadFile( info )

					// ファイルパスを作成
					const downloadFilePath = path.join( downloadFolderPath, info.fileName )
					developLog( `downloadFilePath: ${ downloadFilePath }` )

					// ファイルを保存
					await fs.writeFile( downloadFilePath, buffer )
					developLog( `file saved to ${ downloadFilePath }` )
				}

				// 処理済みのメッセージidを更新
				lastBackupMessageId = id
				// executeUpdateBackupProgress( connection, channel, Number( id ) )
			}
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
		console.groupEnd()
	}
}

export
{
	backupImage
}