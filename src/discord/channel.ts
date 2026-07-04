import { createConnection } from "@/mysql/dataBase"
import { CHANNEL_INFO_TABLE_NAME, getMySQLChannelInfo, insertMySQLChannelInfo, updateMySQLChannelInfo } from "@/mysql/query"
import { Guild, TextChannel } from "discord.js"
import { findFirstMessageId } from "./util"
import type { Connection } from "mysql2/promise"

/**
 * 対象のサーバーから、指定されたidのテキストチャンネルを取得する関数
 * @param guild - チャンネルを探索するサーバー
 * @param targetChannelIds - チャンネルのid配列
 * @returns 取得できたテキストチャンネルの配列
 */
const getTextChannels = async ( guild: Guild, targetChannelIds: string[] ) =>
{
	const targetChannels: TextChannel[] = []

	// TextChannelのみを取得
	for ( const id of targetChannelIds )
	{
		const channel = await guild.channels.fetch( id )
		if ( channel instanceof TextChannel )
		{
			targetChannels.push( channel )
		} else if ( channel === null )
		{
			console.error( `channel[id: ${ id }] can't find! Please check channel and channel_id.` )
		} else
		{
			console.info( `channel[id: ${ id }] isn't TextChannel. Please check channel and channel_id.` )
		}
	}

	return targetChannels
}

/**
 * 対象チャンネルの情報を表示する関数
 * @param channel - 表示するチャンネル
 */
const logChannelInfo = ( channel: TextChannel ) =>
{
	console.log( `channel ${ channel.name } [id: ${ channel.id }]` )
}


const updateChannelInfo = async ( connection: Connection, channel: TextChannel ) =>
{
	// infoを取得
	const info = await getMySQLChannelInfo( connection, channel )

	// 最初のメッセージのidを取得
	const firstMessageId = await findFirstMessageId( channel )

	// infoの存在で分岐
	// infoが存在すればupdateを、存在しなければinsertを行う
	if ( info.length === 0 )
	{
		console.log( `There are not channel[id: ${ channel.id }] info in ${ CHANNEL_INFO_TABLE_NAME } table.` )
		console.log( `Insert channel[id: ${ channel.id }] info.` )

		// 挿入を実行
		await insertMySQLChannelInfo( connection, channel, firstMessageId )

	} else
	{
		console.log( `There are channel[id: ${ channel.id }] info in ${ CHANNEL_INFO_TABLE_NAME } table.` )
		console.log( `Update channel[id: ${ channel.id }] info.` )

		// 更新を実行
		await updateMySQLChannelInfo( connection, channel, firstMessageId )
	}

	// 接続を閉じる
	await connection.end()
}


export { getTextChannels, logChannelInfo, updateChannelInfo }