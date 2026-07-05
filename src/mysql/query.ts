// 特定のMySQL処理を定義するファイル

import type { TextChannel } from "discord.js"
import type { Connection, ResultSetHeader } from "mysql2/promise"
import squel from "squel"
import type { BackupProgress } from "@/mysql/tables"
import { developLog } from "@/util"

// テーブル名の定数
const BACKUP_PROGRESS_TABLE_NAME = "backup_progress"

/**
 * MySQLからバックアップ進捗を取得する関数
 * @param connection - MySQLとのコネクション
 * @param channel - バックアップ進捗を取得したいチャンネル
 * @returns 取得したバックアップの進捗。情報が存在しない場合空の配列を返す
 */
const executeSelectBackupProgress = async ( connection: Connection, channel: TextChannel ) =>
{
	console.group( "execut select" )

	const sql = squel
		.select().from( BACKUP_PROGRESS_TABLE_NAME )
		.where( "channel_id = ?", channel.id )
		.toString()
	developLog( `execute sql: ${ sql }` )

	const [ progress ] = await connection.query<BackupProgress[]>( sql )
	developLog( progress )

	console.groupEnd()

	return progress
}

/**
 * MySQL上のバックアップ進捗を更新する関数
 * @param connection - MySQLとのコネクション
 * @param channel - バックアップ進捗を挿入したいチャンネル
 * @returns　挿入結果
 */
const executeUpdateBackupProgress = async ( connection: Connection, channel: TextChannel, messageId: string ) =>
{
	console.group( "execut update" )

	const sql = squel
		.update().table( BACKUP_PROGRESS_TABLE_NAME )
		.set( "last_backup_message_id", messageId )
		.where( "channel_id = ?", channel.id )
		.toString()
	developLog( `execute sql: ${ sql }` )

	const [ result ] = await connection.execute<ResultSetHeader>( sql )
	developLog( result )

	console.groupEnd()

	return result

}

/**
 * MySQL上にバックアップ進捗を挿入する
 * @param connection - MySQLとのコネクション
 * @param channel - バックアップ進捗を更新したいチャンネル
 * @returns　更新結果
 */
const executeInsertBackupProgress = async ( connection: Connection, channel: TextChannel, messageId: string ) =>
{
	console.group( "execut insert" )

	const sql = squel
		.insert().into( BACKUP_PROGRESS_TABLE_NAME )
		.set( "channel_id", channel.id )
		.set( "last_backup_message_id", messageId )
		.toString()
	developLog( `execute sql: ${ sql }` )

	const [ result ] = await connection.execute<ResultSetHeader>( sql )
	developLog( result )

	console.groupEnd()

	return result
}

export
{
	BACKUP_PROGRESS_TABLE_NAME,
	executeSelectBackupProgress,
	executeUpdateBackupProgress,
	executeInsertBackupProgress
}