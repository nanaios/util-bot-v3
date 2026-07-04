// 汎用的な関数を定義するファイル

import dotenv from "dotenv"

// 環境変数の初期化
dotenv.config()

/**
 * このプログラムがdevelopmentであるかを表すフラグ
 */
const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === "development"

/**
 * 値がnull,undefinedでは無いことを保証する関数です。
 * 値がnull,undefinedの場合、TypeErrorが発生します。
 * @param value null,undefinedの可能性のある値
 * @returns 
 */
const notNull = <T> ( value: T ): NonNullable<T> =>
{
	if ( value === undefined || value === null )
	{
		throw new TypeError( `value is ${ value }!` )
	}
	return value
}

/**
 * NODE_ENVがdevelopmentの時のみ動作するログ関数
 */
const developLog = ( message?: any, ...optionalParams: any[] ) =>
{
	if ( IS_DEVELOPMENT_MODE )
	{
		console.debug( message, ...optionalParams )
	}
}

export
{
	notNull,
	developLog,
	IS_DEVELOPMENT_MODE
}