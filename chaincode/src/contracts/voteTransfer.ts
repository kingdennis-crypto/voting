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
import Candidate from '../models/candidate'

import DummyVotes from '../data/dummyVotes'
import AuthorizationHelper from '../utils/helpers/authorization'

@Info({
  title: 'VoteTransfer',
  description: 'Smart contract for voting on candidates',
})
export class VoteTransferContract extends Contract {
  @Transaction()
  public async CreateVote(
    ctx: Context,
    id: string,
    timestamp: string,
    candidateId: string
  ): Promise<string> {
    if (!AuthorizationHelper.isVoter(ctx.clientIdentity))
      throw new Error('Only a voter can vote!')

    id = `v-${id}`

    const exists = await this.VoteExists(ctx, id)

    if (exists) {
      throw new Error(`The vote ${id} already exists`)
    }

    const vote: Vote = { id, timestamp, candidateId }

    const object = Buffer.from(stringify(sortKeysRecursive(vote)))

    await ctx.stub.putState(id, object)
    ctx.stub.setEvent('CreateVoteEvent', object)

    return JSON.stringify(vote)
  }

  @Transaction(false)
  public async ReadCandidate(ctx: Context, id: string): Promise<string> {
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
