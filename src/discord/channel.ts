import { Guild, TextChannel } from "discord.js"

/**
 * 対象のサーバーから、指定されたidのテキストチャンネルを取得する関数
 * @param guild - チャンネルを探索するサーバー
 * @param targetChannelIds - チャンネルのid配列
 * @returns 取得できたテキストチャンネルの配列
 */
const getTextChannels = async ( guild: Guild, targetChannelIds: string[] ) =>
{
	const targetChannels: TextChannel[] = []

	// TextChannelを取得
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


export { getTextChannels, logChannelInfo }