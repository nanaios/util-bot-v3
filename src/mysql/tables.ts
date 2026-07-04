// MySQLサーバーのテーブルの型定義用ファイル

import type { RowDataPacket } from "mysql2"

/**
 * channel_infoテーブルの型定義
 */
interface ChannelInfo extends RowDataPacket
{
	channel_id: number
	channel_name: string
	first_message_id: number
}

/**
 * backup_progressテーブルの型定義
 */
interface BackupProgress extends RowDataPacket
{
	channel_id: number
	last_backup_message_id: number
}

export
{
	ChannelInfo,
	BackupProgress
}