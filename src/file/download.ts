import type { Message } from "discord.js"
import fs from "fs/promises"

interface DownloadInfo
{
	fileName: string
	url: string
	contentType: string
}

/**
 * メッセージから添付ファイルのダウンロードに必要な情報を取得してまとめる関数
 * @param message - 対象のメッセージ
 * @returns 
 */
const createDownloadFileInfos = ( message: Message<true> ) =>
{
	const infos: DownloadInfo[] = []

	// 各添付ファイルのinfoを生成
	for ( const [ key, attachment ] of message.attachments )
	{
		// infoを作成
		const info: DownloadInfo = {
			fileName: `${ key }-${ attachment.name }`,
			url: attachment.url,
			contentType: attachment.contentType ?? ""
		}
		infos.push( info )
	}

	return infos
}

const downloadFile = async ( info: DownloadInfo ) =>
{
	const res = await fetch( info.url )

	const arrayBuffer = await res.arrayBuffer()
	const buffer = Buffer.from( arrayBuffer )

	await fs.writeFile( "image.png", buffer )
}

export { createDownloadFileInfos }