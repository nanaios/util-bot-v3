// メッセージを直接処理する関数を定義するファイル

import type { TextChannel } from "discord.js"

/**
 * 対象チャンネル内で最初に投稿されたメッセージを取得し、メッセージのidを返す関数
 * @param channel - メッセージの取得元のチャンネル
 * @returns メッセージのid。取得に失敗した場合、0を返す
 */
const findFirstMessageId = async ( channel: TextChannel ) =>
{
	// discord apiのafterは指定したキーより後を取得するため、0を指定することでメッセージを古い順に取得できる
	const messages = await channel.messages.fetch( {
		cache: false,
		after: "0",
		limit: 1
	} )

	return messages.keyAt( 0 ) ?? "0"
}

export
{
	findFirstMessageId
}