import { developLog, notNull } from "@/util"
import type { Message, TextChannel } from "discord.js"
import fs from "fs/promises"
import path from "path"

// ダウンロード先のフォルダを取得
const DOWNLOAD_FOLDER = notNull( process.env.DOWNLOAD_FOLDER )

/**
 * ダウンロード情報
 */
interface DownloadInfo
{
	fileName: string
	url: string
	contentType: string
}

/**
 * メッセージから添付ファイルのダウンロードに必要な情報を取得してまとめる関数
 * @param message - 対象のメッセージ
 * @returns ダウンロード情報の配列
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

/**
 * ファイルをダウンロードする関数
 * @param info - ダウンロードするファイルの情報
 * @returns ファイルのバッファー
 */
const downloadFile = async ( info: DownloadInfo ) =>
{
	const res = await fetch( info.url )

	const arrayBuffer = await res.arrayBuffer()
	return Buffer.from( arrayBuffer )
}

/**
 * ダウンロード先のフォルダを作成し、そのフォルダのパスを返す
 * フォルダが存在している場合、作成は行われない
 * @param channel - 作成するフォルダのチャンネル
 * @returns ダウンロード先のフォルダのパス
 */
const createDownloadFolder = async ( channel: TextChannel ) =>
{
	// ダウンロード先のフォルダパスを作成
	const downloadFolderPath = path.join( process.cwd(), DOWNLOAD_FOLDER, channel.id )
	developLog( `downloadFolderPath: ${ downloadFolderPath }` )

	// ダウンロードフォルダを作成
	// 既に存在している場合は何も行われない 
	await fs.mkdir( downloadFolderPath, { recursive: true } )

	return downloadFolderPath
}

export { createDownloadFileInfos, downloadFile, createDownloadFolder }