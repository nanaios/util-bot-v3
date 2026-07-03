import EventEmitter from "events"
import type { Connection, ConnectionOptions, FieldPacket, PreparedStatementInfo, QueryOptions, QueryResult, QueryValues } from "mysql2/promise"
import { type Delete, type Insert, type Select, type Update, type Squel, squel } from "squel"
import { MySQLQueryError } from "./error"

/**
 * {@link Squel}のクエリーとして処理できるものをまとめた型
 */
type Queryable = Select | Insert | Update | Delete

/**
 * {@link Connection}を抽象化したinterface
 */
interface IConnection extends Connection
{
	query<T extends QueryResult> ( sql: string, values?: QueryValues ): Promise<[ T, FieldPacket[] ]>
	query<T extends QueryResult> ( options: QueryOptions, values?: QueryValues ): Promise<[ T, FieldPacket[] ]>
	query<T extends QueryResult> ( sql: Queryable, values?: QueryValues ): Promise<[ T, FieldPacket[] ]>
}

/**
 * 与えられた引数が{@link QueryOptions}型かどうか判定します
 * @param arg 
 * @returns 
 */
const isQueryOptions = ( arg: unknown ): arg is QueryOptions =>
{
	return "sql" in ( arg as any )
}

const isQueryable = ( arg: unknown ): arg is Queryable =>
{
	return "options" in ( arg as any )
}

/**
 * {@link Connection}をラップして、{@link IConnection}として使用できるようにしたもの
 */
class ConnectionWrapper implements IConnection
{
	private connection: Connection
	public get config ()
	{
		return this.connection.config
	}

	public set config ( value )
	{
		this.connection.config = value
	}

	get threadId ()
	{
		return this.connection.threadId
	}
	set threadId ( value )
	{
		this.connection.threadId = value
	}

	get state ()
	{
		return this.connection.state
	}

	constructor ( connection: Connection )
	{
		this.connection = connection
	}
	query<T extends QueryResult> ( options: unknown, values?: QueryValues ): Promise<[ T, FieldPacket[] ]> | Promise<[ T, FieldPacket[] ]>
	{
		if ( typeof options === "string" )
		{
			return this.connection.query( options, values )
		} else if ( isQueryOptions( options ) )
		{
			return this.connection.query( options, values )
		}
		else if ( isQueryable( options ) )
		{
			return this.connection.query( options.toString(), values )
		} else
		{
			throw new MySQLQueryError( "The argument cannot be processed as a query." )
		}
	}
	execute<T> ( options: unknown, values?: unknown ): Promise<[ T, FieldPacket[] ]> | Promise<[ T, FieldPacket[] ]>
	{
		return this.connection.execute( options as any, values as any ) as any
	}
	[ EventEmitter.captureRejectionSymbol ]?<K> ( error: Error, event: string | symbol, ...args: any[] ): void
	{
		const func = this.connection[ EventEmitter.captureRejectionSymbol ]
		if ( func !== undefined )
		{
			return func( error, event, ...args )
		}
	}
	addListener<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.addListener( eventName, listener )
		return this
	}
	on<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.on( eventName, listener )
		return this
	}
	once<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.once( eventName, listener )
		return this
	}
	removeListener<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.removeListener( eventName, listener )
		return this
	}
	off<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.off( eventName, listener )
		return this
	}
	removeAllListeners ( eventName?: string | symbol | undefined ): this
	{
		this.connection.removeAllListeners( eventName )
		return this
	}
	setMaxListeners ( n: number ): this
	{
		this.connection.setMaxListeners( n )
		return this
	}
	getMaxListeners (): number
	{
		return this.connection.getMaxListeners()
	}
	listeners<K> ( eventName: string | symbol ): Function[]
	{
		return this.connection.listeners( eventName )
	}
	rawListeners<K> ( eventName: string | symbol ): Function[]
	{
		return this.connection.rawListeners( eventName )
	}
	emit<K> ( eventName: string | symbol, ...args: any[] ): boolean
	{
		return this.connection.emit( eventName )
	}
	listenerCount<K> ( eventName: string | symbol, listener?: Function | undefined ): number
	{
		return this.connection.listenerCount( eventName, listener )
	}
	prependListener<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.prependListener( eventName, listener )
		return this
	}
	prependOnceListener<K> ( eventName: string | symbol, listener: ( ...args: any[] ) => void ): this
	{
		this.connection.prependOnceListener( eventName, listener )
		return this
	}
	eventNames (): ( string | symbol )[]
	{
		return this.connection.eventNames()
	}



	connect (): Promise<void>
	{
		return this.connection.connect()
	}
	ping (): Promise<void>
	{
		return this.connection.ping()
	}
	reset (): Promise<void>
	{
		return this.connection.reset()
	}
	beginTransaction (): Promise<void>
	{
		return this.connection.beginTransaction()
	}
	commit (): Promise<void>
	{
		return this.connection.commit()
	}
	rollback (): Promise<void>
	{
		return this.connection.rollback()
	}
	changeUser ( options: ConnectionOptions ): Promise<void>
	{
		return this.connection.changeUser( options )
	}
	prepare ( options: string | QueryOptions ): Promise<PreparedStatementInfo>
	{
		return this.connection.prepare( options )
	}
	unprepare ( sql: string | QueryOptions ): void
	{
		return this.connection.unprepare( sql )
	}
	end ( options?: any ): Promise<void>
	{
		return this.connection.end( options )
	}
	destroy (): void
	{
		return this.connection.destroy()
	}
	pause (): void
	{
		return this.connection.pause()
	}
	resume (): void
	{
		return this.connection.resume()
	}
	escape ( value: any ): string
	{
		return this.connection.escape( value )
	}
	escapeId ( value: string ): string
	escapeId ( values: string[] ): string
	escapeId ( values: unknown ): string
	{
		return this.connection.escapeId( values as any )
	}
	format ( sql: string, values?: any | any[] | { [ param: string ]: any } ): string
	{
		return this.connection.format( sql, values )
	}
	[ Symbol.asyncDispose ] (): Promise<void>
	{
		return this.connection[ Symbol.asyncDispose ]()
	}
}

export { IConnection, ConnectionWrapper }