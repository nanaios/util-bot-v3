import { Client, GatewayIntentBits, TextChannel, type TextBasedChannel } from "discord.js"
import { readEnvJson } from "./envJson"
import { findFirstMessageId } from "./imageCollector"

const MAIN_START_DELAY = 1000

// 必要な環境変数を読み込む
const env = await readEnvJson()

// Botのインスタンスを作成
const client = new Client( {
	intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages ],
} )

// Botのメイン処理
const backup = async () =>
{
	if ( !client.isReady() ) return

	// 対象Guildの対象Channelを取得
	const targetGuild = await client.guilds.fetch( env.targetGuildId )
	const targetChannels: TextChannel[] = []

	// TextChannelを取得
	for ( const id of env.targetChannelIds )
	{
		const channel = await targetGuild.channels.fetch( id )
		if ( channel instanceof TextChannel )
		{
			targetChannels.push( channel )
		}
	}

	// Channelの最初のメッセージを取得
	for ( const channel of targetChannels )
	{
		console.log( `find channel ${ channel?.name } [id: ${ channel?.id }]` )
		const oldestMessageId = await findFirstMessageId( channel )
		console.log( `oldest message id: ${ oldestMessageId }` )

		console.log()
	}
}

client.once( "clientReady", ( client ) =>
{
	console.log( `Bot ${ client.user.displayName } is ready!` )

	// setTimeoutで、指定秒数後からバックアップ処理を開始
	setTimeout( backup, MAIN_START_DELAY )
	console.log( `The backup will start in ${ MAIN_START_DELAY } seconds.` )
} )

client.login( env.loginToken )