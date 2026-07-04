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

export { ChannelInfo }