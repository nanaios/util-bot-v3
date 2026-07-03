import type { TextChannel } from "discord.js"

/**
 * 対象チャンネル内で最初に投稿されたメッセージを取得し、メッセージのidを返す関数
 * @param channel - メッセージの取得元のチャンネル
 * @returns メッセージのid
 */
export const findFirstMessageId = async ( channel: TextChannel ) =>
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
