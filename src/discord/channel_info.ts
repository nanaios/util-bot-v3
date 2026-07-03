import type { TextChannel } from "discord.js"
import { createConnection } from "../mysql/util"
import type { RowDataPacket } from "mysql2"
import { devLog } from "../util"
import { findFirstMessageId } from "./util"
import squel from "squel"

const CHANNEL_INFO_TABLE_NAME = "channel_info"

const updateChannelInfo = async ( channel: TextChannel ) =>
{
	// コネクションを用意
	const dbc = await createConnection()

	// 最初のメッセージのIDを取得
	const firstMessageId = await findFirstMessageId( channel )

	// テーブルにチャンネルの情報があるかチェック
	const selectSql = squel.select().field( "count(*)" ).from( CHANNEL_INFO_TABLE_NAME ).where( `channel_id = ${ channel.id }` )
	const [ selectResult ] = await dbc.query<RowDataPacket[]>( selectSql )
	const count = selectResult[ 0 ][ "count(*)" ] as Number

	devLog( `selectSql = ${ selectSql }` )
	devLog( `result = ${ selectResult }` )

	// チャンネルの情報が存在すれば更新、しなければ新規作成を行う
	if ( count === 0 )
	{
		// 情報が存在しないので新規作成
		const insertSql = `insert `
	} else
	{
		// 情報が存在するので更新
		const updateSql = `update `

	}

	await dbc.end()
}


export { updateChannelInfo }