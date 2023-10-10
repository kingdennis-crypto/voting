import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from 'fabric-contract-api'
import Party from '../models/party'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

@Info({
  title: 'PartyTransfer',
  description: 'Smart contract for voting on candidates',
})
export class PartyTransferContract extends Contract {
  @Transaction(true)
  public async InitLedger(ctx: Context): Promise<void> {
    // TODO: Add dummy data
    const parties: Party[] = [
      {
        id: '1',
        name: 'party1',
      },
      {
        id: '2',
        name: 'party2',
      },
    ]

    parties.forEach(async (party) => {
      await ctx.stub.putState(
        party.id,
        Buffer.from(stringify(sortKeysRecursive({ ...party })))
      )
      console.info(`Party ${party.id} initialized`)
    })
  }

  @Transaction()
  public async CreateParty(
    ctx: Context,
    id: string,
    name: string
  ): Promise<void> {
    const exists = await this.PartyExists(ctx, id)

    if (exists) {
      throw new Error(`The party ${id} already exists`)
    }

    // const party: Party = new Party(id, name)
    const party: Party = { id, name }
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(party)))
    )
  }

  @Transaction(false)
  public async ReadParty(ctx: Context, id: string): Promise<string> {
    const partyRecord = await ctx.stub.getState(id)

    if (!partyRecord || partyRecord.length === 0) {
      throw new Error(`The asset ${id} does not exist`)
    }

    return partyRecord.toString()
  }

  @Transaction()
  public async UpdateParty(
    ctx: Context,
    id: string,
    name: string
  ): Promise<void> {
    const exists = await this.PartyExists(ctx, id)

    if (!exists) {
      throw new Error(`The party ${id} does not exist`)
    }

    const party: Party = new Party(id, name)
    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(party)))
    )
  }

  @Transaction()
  public async DeleteParty(ctx: Context, id: string): Promise<void> {
    const exists = await this.PartyExists(ctx, id)

    if (!exists) {
      throw new Error(`The party ${id} does not exist`)
    }

    return ctx.stub.deleteState(id)
  }

  @Transaction(false)
  @Returns('string')
  public async PartyExists(ctx: Context, id: string): Promise<boolean> {
    const partyJSON = await ctx.stub.getState(id)
    return partyJSON && partyJSON.length > 0
  }

  @Transaction(false)
  public async GetAllParties(ctx: Context): Promise<string> {
    const allParties = []

    const iterator = await ctx.stub.getStateByRange('', '')
    let result = await iterator.next()

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf-8'
      )

      let record: Party | string

      try {
        record = JSON.parse(strValue)
      } catch (error) {
        console.log(error)
        record = strValue
      }

      allParties.push(record)
      result = await iterator.next()
    }

    return JSON.stringify(allParties)
  }
}
