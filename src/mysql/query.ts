// 特定のMySQL処理を定義するファイル

import type { Channel, TextChannel } from "discord.js"
import type { Connection, ResultSetHeader } from "mysql2/promise"
import squel from "squel"
import type { BackupProgress, ChannelInfo } from "@/mysql/tables"
import { developLog } from "@/util"

// テーブル名の定数
const BACKUP_PROGRESS_TABLE_NAME = "backup_progress"

/**
 * MySQLからバックアップ進捗を取得
 * @param connection - MySQLとのコネクション
 * @param channel - バックアップ進捗を取得したいチャンネル
 * @returns 取得したバックアップの進捗。情報が存在しない場合空の配列を返す
 */
const executeSelectBackupProgress = async ( connection: Connection, channel: TextChannel ) =>
{
	const sql = squel
		.select().from( BACKUP_PROGRESS_TABLE_NAME )
		.where( "channel_id = ?", channel.id )
		.toString()

	const [ progress ] = await connection.query<BackupProgress[]>( sql )
	developLog( progress )

	return progress
}

export
{
	BACKUP_PROGRESS_TABLE_NAME,
	executeSelectBackupProgress
}