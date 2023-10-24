import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from 'fabric-contract-api'
import Vote from '../models/vote'

import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'

import AuthorizationHelper from '../utils/helpers/authorization'

@Info({
  title: 'VoteTransfer',
  description: 'Smart contract for voting on candidates',
})
export class VoteTransferContract extends Contract {
  // A mapping of addresses to their balance
  private balances: Record<string, number> = {}
  private totalSupply: number = 0
  private usedTokens: number = 0

  @Transaction()
  public async DistributeTokens(ctx: Context, amount: number) {
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can distribute the tokens')

    this.totalSupply = amount
    this.usedTokens = 0
    this.balances = {}

    return JSON.stringify({ message: 'Token distributed successfully' })
  }

  @Transaction()
  public async Vote(
    ctx: Context,
    id: string,
    timestamp: string,
    candidateId: string
  ) {
    const cID = ctx.clientIdentity.getID()
    const vID = 'v-' + id

    // if (!AuthorizationHelper.isVoter(ctx.clientIdentity))
    // TODO: Change this to isVoter
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only a admin can vote!')

    const vote: Vote = { id: vID, timestamp, candidateId }

    const payload = Buffer.from(stringify(sortKeysRecursive(vote)))

    await ctx.stub.putState(vID, payload)
    ctx.stub.setEvent('VoteEvent', payload)

    this.usedTokens++
    // this.balances[cID]++

    if (this.balances[cID]) {
      this.balances[cID]++
    } else {
      this.balances[cID] = 1
    }

    return JSON.stringify(vote)
  }

  @Transaction(false)
  public async GetUnusedTokens(ctx: Context) {
    return this.totalSupply - this.usedTokens
  }

  @Transaction(false)
  public async GetAllVoterBalances(ctx: Context) {
    return JSON.stringify(this.balances)
  }

  @Transaction(false)
  public async GetVoterBalance(ctx: Context) {
    return this.balances[ctx.clientIdentity.getID()]
  }

  @Transaction(false)
  public async GetTotalSupply(ctx: Context) {
    return this.totalSupply
  }

  @Transaction(false)
  public async ReadVote(ctx: Context, id: string): Promise<string> {
    const voteJSON = await ctx.stub.getState(id)

    if (!voteJSON || voteJSON.length === 0) {
      throw new Error(`The candidate ${id} does not exist`)
    }

    return voteJSON.toString()
  }

  @Transaction(false)
  @Returns('boolean')
  public async VoteExists(ctx: Context, id: string): Promise<boolean> {
    const voteJSON = await ctx.stub.getState(id)
    return voteJSON && voteJSON.length > 0
  }

  @Transaction(false)
  @Returns('string')
  public async GetAllVotes(ctx: Context): Promise<string> {
    const allVotes = []

    const iterator = await ctx.stub.getStateByRange('v-', 'v-~')
    let result = await iterator.next()

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf-8'
      )

      let record: Vote | string

      try {
        record = JSON.parse(strValue)
      } catch (error) {
        console.log(error)
        record = strValue
      }

      allVotes.push(record)
      result = await iterator.next()
    }

    return JSON.stringify(allVotes)
  }
}
