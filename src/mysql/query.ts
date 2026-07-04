// 特定のMySQL処理を定義するファイル

import type { Channel, TextChannel } from "discord.js"
import type { Connection, ResultSetHeader } from "mysql2/promise"
import squel from "squel"
import type { BackupProgress, ChannelInfo } from "@/mysql/tables"
import { developLog } from "@/util"

// テーブル名の定数
const CHANNEL_INFO_TABLE_NAME = "channel_info"
const BACKUP_PROGRESS_TABLE_NAME = "backup_progress"

/**
 * MySQLからチャンネルの情報を取得する
 * @param connection - MySQLとのコネクション
 * @param channel - 情報を取得したいチャンネル
 * @returns 取得したチャンネルの情報。情報が存在しない場合空の配列を返す
 */
const executeSelectChannelInfo = async ( connection: Connection, channel: TextChannel ) =>
{
	// SQL文を組み立て
	const sql = squel
		.select().from( CHANNEL_INFO_TABLE_NAME )
		.where( "channel_id = ?", channel.id )
		.toString()
	developLog( `get channel info sql: ${ sql }` )

	// SQL文を実行
	const [ info ] = await connection.query<ChannelInfo[]>( sql )
	developLog( info )

	return info
}


/**
 * MySQLへチャンネルの情報を挿入する
 * @param connection - MySQLとのコネクション
 * @param channel - 情報を挿入したいチャンネル
 * @returns 挿入したチャンネルの情報。
 */
const executeInsertChannelInfo = async ( connection: Connection, channel: TextChannel, firstMessageId: string ) =>
{
	// SQL文を組み立て
	const sql = squel
		.insert().into( CHANNEL_INFO_TABLE_NAME )
		.set( "channel_info", channel.id )
		.set( "channel_name", channel.name )
		.set( "first_message_id", firstMessageId )
		.toString()
	developLog( `insert channel info sql: ${ sql }` )

	// SQL文を実行
	const [ info ] = await connection.execute<ResultSetHeader>( sql )
	developLog( info )

	return info
}

/**
 * MySQLのチャンネルの情報を更新する
 * @param connection - MySQLとのコネクション
 * @param channel - 情報を更新したいチャンネル
 * @returns 更新したチャンネルの情報。
 */
const executeUpdateChannelInfo = async ( connection: Connection, channel: TextChannel, firstMessageId: string ) =>
{
	// SQL文を組み立て
	const sql = squel
		.update().table( CHANNEL_INFO_TABLE_NAME )
		.set( "channel_name", channel.name )
		.set( "first_message_id", firstMessageId )
		.where( "channel_id = ?", channel.id )
		.toString()
	developLog( `update channel info sql: ${ sql }` )

	// SQL文を実行
	const [ info ] = await connection.execute<ResultSetHeader>( sql )
	developLog( info )

	return info
}


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
	CHANNEL_INFO_TABLE_NAME,
	BACKUP_PROGRESS_TABLE_NAME,
	executeSelectChannelInfo,
	executeInsertChannelInfo,
	executeUpdateChannelInfo,
	executeSelectBackupProgress
}