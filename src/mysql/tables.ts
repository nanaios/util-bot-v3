// MySQLサーバーのテーブルの型定義用ファイル

import type { RowDataPacket } from "mysql2"

/**
 * backup_progressテーブルの型定義
 */
interface BackupProgress extends RowDataPacket
{
	channel_id: string
	last_backup_message_id: string
}

export
{
	BackupProgress
}