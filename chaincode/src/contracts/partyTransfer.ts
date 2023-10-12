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
import { v4 as uuidv4 } from 'uuid'

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
  ): Promise<string> {
    // TODO: Do not use uuidv4 here!!
    // On multiple peers it will generate different UUID's and it will crash
    // const id = uuidv4()
    id = `p-${id}`
    const exists = await this.PartyExists(ctx, id)

    if (exists) {
      throw new Error(`The party ${id} already exists`)
    }

    const party: Party = { id, name }
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(party)))
    )

    return JSON.stringify(party)
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
  ): Promise<string> {
    const exists = await this.PartyExists(ctx, id)

    if (!exists) {
      throw new Error(`The party ${id} does not exist`)
    }

    // const party: Party = new Party(id, name)
    const party: Party = { id, name }
    ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(party))))

    return JSON.stringify(party)
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
  // TODO: Change from checking id to checking name
  public async PartyExists(ctx: Context, id: string): Promise<boolean> {
    const partyJSON = await ctx.stub.getState(id)
    return partyJSON && partyJSON.length > 0
  }

  @Transaction(false)
  public async GetAllParties(ctx: Context): Promise<string> {
    const allParties = []

    const iterator = await ctx.stub.getStateByRange('p-', 'p-~')
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
