import mysql from "mysql2/promise"
import { devLog, notNull } from "./util"

// MySQL用の環境変数を取得
const MYSQL_HOST = notNull( process.env.MYSQL_HOST )
const MYSQL_USER = notNull( process.env.MYSQL_USER )
const MYSQL_PASSWORD = notNull( process.env.MYSQL_PASSWORD )
const MYSQL_DATABASE = notNull( process.env.MYSQL_DATABASE )

devLog( `MYSQL_HOST = ${ MYSQL_HOST }` )
devLog( `MYSQL_USER = ${ MYSQL_USER }` )
devLog( `MYSQL_PASSWORD = ${ MYSQL_PASSWORD }` )
devLog( `MYSQL_DATABASE = ${ MYSQL_DATABASE }` )

/**
 * MySQL用のコネクションを生成します
 * @returns 
 */
const createConnection = () =>
{
	return mysql.createConnection( {
		host: MYSQL_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DATABASE
	} )
}

export { createConnection }