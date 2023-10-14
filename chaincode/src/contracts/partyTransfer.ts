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
import AuthorizationHelper from '../utils/helpers/authorization'

@Info({
  title: 'PartyTransfer',
  description: 'Smart contract for voting on candidates',
})
export class PartyTransferContract extends Contract {
  @Transaction()
  public async CreateParty(
    ctx: Context,
    id: string,
    name: string
  ): Promise<string> {
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

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
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

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
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

    const exists = await this.PartyExists(ctx, id)

    if (!exists) {
      throw new Error(`The party ${id} does not exist`)
    }

    const candidates = await ctx.stub.getStateByRange('c-', 'c-~')
    let result = await candidates.next()

    // while (!result.done) {
    //   const strValue = Buffer.from(result.value.value.toString()).toString(
    //     'utf-8'
    //   )

    //   let record: Party | string

    //   try {
    //     record = JSON.parse(strValue)
    //   } catch (error) {
    //     console.log(error)
    //     record = strValue
    //   }

    //   await ctx.stub.deleteState(result.value.key)
    // }

    return await ctx.stub.deleteState(id)
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
