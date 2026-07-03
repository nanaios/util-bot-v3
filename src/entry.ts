// Botの実行起点となるファイル

import { Client, GatewayIntentBits } from "discord.js"
import { devLog, notNull } from "./util"
import { main } from "./main"

// 環境変数を取得
const BOT_LOGIN_TOKEN = notNull( process.env.BOT_LOGIN_TOKEN )

devLog( `BOT_LOGIN_TOKEN = ${ BOT_LOGIN_TOKEN }` )

// Botのインスタンスを作成
const client = new Client( {
	intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages ],
} )

client.once( "clientReady", ( client ) =>
{
	console.log( `Bot ${ client.user.displayName } is ready!` )

	// メイン処理を実行
	main( client )
} )

// Botにログイン
client.login( BOT_LOGIN_TOKEN )
devLog( "client login" )