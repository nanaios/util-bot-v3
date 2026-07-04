import mysql from "mysql2/promise"
import { developLog, notNull } from "@/util"

// MySQL用の環境変数を取得
const MYSQL_HOST = notNull( process.env.MYSQL_HOST )
const MYSQL_USER = notNull( process.env.MYSQL_USER )
const MYSQL_PASSWORD = notNull( process.env.MYSQL_PASSWORD )
const MYSQL_DATABASE = notNull( process.env.MYSQL_DATABASE )

developLog( `MYSQL_HOST = ${ MYSQL_HOST }` )
developLog( `MYSQL_USER = ${ MYSQL_USER }` )
developLog( `MYSQL_PASSWORD = ${ MYSQL_PASSWORD }` )
developLog( `MYSQL_DATABASE = ${ MYSQL_DATABASE }` )

/**
 * MySQL用のコネクションを生成します
 * @returns MySQLのコネクション
 */
const createConnection = () =>
{
	developLog( "create connection" )
	return mysql.createConnection( {
		host: MYSQL_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DATABASE
	} )
}

export { createConnection }