import { vi, describe, it, expect } from "vitest"

//mock用オブジェクトを定義
const mockIConnection = {
	query: vi.fn(),
	end: vi.fn()
}
const mockChannel = {
	id: "mocked channel!"
} as any as TextChannel

// mockを定義
vi.mock( "../../src/mysql/util.ts", () => ( {
	createConnection: vi.fn( () => mockIConnection )
} ) )
vi.mock( "../../src/discord/util.ts", () => ( {
	findFirstMessageId: vi.fn( ( channel: TextChannel ) => "mocked message id!" )
} ) )

//テスト対象をimport
import { updateChannelInfo } from "../../src/discord/channel_info"
import type { TextChannel } from "discord.js"

describe( "channel_info unit test", () =>
{
	it( "updateChannelInfo test", async () =>
	{
		// mockを設定
		const retValFn = vi.fn( () => 1 )
		mockIConnection.query.mockImplementationOnce( ( sql ) =>
		{
			return [ [ {
				get "count(*)" ()
				{
					return retValFn()
				}
			} ] ]
		} )

		await updateChannelInfo( mockChannel )

		expect( retValFn ).toHaveBeenCalledOnce()
		expect( mockIConnection.query ).toHaveBeenCalledOnce()
		expect( mockIConnection.end ).toHaveBeenCalledOnce()
	} )
} )