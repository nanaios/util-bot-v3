import type { TextChannel } from "discord.js"
import { createConnection } from "./mysql_util"
import type { RowDataPacket } from "mysql2"
import { devLog } from "./util"

const CHANNEL_INFO_TABLE_NAME = "channel_info"

/**
 * 対象チャンネル内で最初に投稿されたメッセージを取得し、メッセージIDを返す
 * @param channel 
 * @returns 
 */
const findFirstMessageId = async ( channel: TextChannel ) =>
{
	// 最新のメッセージを確認
	if ( !channel.lastMessageId ) return ""

	// 取得の開始Idを設定
	let currentMessageId = channel.lastMessageId

	while ( true )
	{

		// メッセージを取得
		const messages = await channel.messages.fetch( {
			cache: false,
			before: currentMessageId,
			limit: 100
		} )

		// 取得した中で最古のメッセージを取得
		let oldestMessage = messages.last()
		if ( !oldestMessage ) break

		currentMessageId = oldestMessage.id
	}

	return currentMessageId
}


const updateChannelInfo = async ( channel: TextChannel ) =>
{
	// コネクションを用意
	const dbc = await createConnection()

	// 最初のメッセージのIDを取得
	const firstMessageId = await findFirstMessageId( channel )

	// テーブルにチャンネルの情報があるかチェック
	const selectSql = `select count(*) from ${ CHANNEL_INFO_TABLE_NAME } where channel_id = ${ channel.id }`
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