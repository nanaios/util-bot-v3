import { Client, GatewayIntentBits, TextChannel, type TextBasedChannel } from "discord.js"
import { devLog, notNull } from "./util"
import { updateChannelInfo } from "./channel_info"

// 環境変数を取得
const BOT_LOGIN_TOKEN = notNull( process.env.BOT_LOGIN_TOKEN )
const TARGET_GUILD_ID = notNull( process.env.TARGET_GUILD_ID )
const TARGET_CHANNEL_IDS = notNull( process.env.TARGET_CHANNEL_IDS ).split( "," )

// Bot起動後、バックアップ処理が開始するまでの遅延時間を定義
const MAIN_START_DELAY = 1000

devLog( `BOT_LOGIN_TOKEN = ${ BOT_LOGIN_TOKEN }` )
devLog( `TARGET_GUILD_ID = ${ TARGET_GUILD_ID }` )
devLog( `TARGET_CHANNEL_IDS = ${ TARGET_CHANNEL_IDS }` )
devLog( `MAIN_START_DELAY = ${ MAIN_START_DELAY }` )

// Botのインスタンスを作成
const client = new Client( {
	intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages ],
} )

// Botのメイン処理
const backup = async () =>
{
	if ( !client.isReady() ) return

	// 対象Guildの対象Channelを取得
	const targetGuild = await client.guilds.fetch( TARGET_GUILD_ID )
	const targetChannels: TextChannel[] = []

	// TextChannelを取得
	for ( const id of TARGET_CHANNEL_IDS )
	{
		const channel = await targetGuild.channels.fetch( id )
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

	// Channel情報hを更新
	for ( const channel of targetChannels )
	{
		console.log( `find channel ${ channel?.name } [id: ${ channel?.id }]` )
		await updateChannelInfo( channel )
	}
}

// Bot起動時に呼び出されるよう設定
client.once( "clientReady", ( client ) =>
{
	console.log( `Bot ${ client.user.displayName } is ready!` )

	// setTimeoutで、指定秒数後からバックアップ処理を開始
	setTimeout( backup, MAIN_START_DELAY )
	console.log( `The backup will start in ${ MAIN_START_DELAY } seconds.` )
} )

// Botにログイン
client.login( BOT_LOGIN_TOKEN )
devLog( "client login" )