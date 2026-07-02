import type { TextChannel } from "discord.js"
import { createConnection } from "./mysql_util"
import type { RowDataPacket } from "mysql2"
import { devLog } from "./util"

const CHANNEL_INFO_TABLE_NAME = "channel_info"

const updateChannelInfo = async ( channel: TextChannel ) =>
{
	// コネクションを用意
	const dbc = await createConnection()

	// テーブルにchannelの情報があるかチェック
	const selectChannelSql = `select count(*) from ${ CHANNEL_INFO_TABLE_NAME } where channel_id = ${ channel.id }`
	const [ selectResult ] = await dbc.query<RowDataPacket[]>( selectChannelSql )
	const count = selectResult[ 0 ][ "count(*)" ] as Number

	devLog( `selectChannelSql = ${ selectChannelSql }` )
	devLog( `result = ${ selectResult }` )

	// channelの情報があれば更新、なければ新規で追加を行う
	if ( count === 0 )
	{

	} else
	{

	}

	await dbc.end()
}


export { updateChannelInfo }