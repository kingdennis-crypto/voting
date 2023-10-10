import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from 'fabric-contract-api'
import Candidate from '../models/candidate'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'
import Party from '../models/party'

import DummyCandidates from '../data/dummyCandidates'

@Info({
  title: 'CandidateTransfer',
  description: 'Smart contract for the management of candidates',
})
export default class CandidateTransferContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    // TODO: Add dummy data
    const candidates: Candidate[] = DummyCandidates

    candidates.forEach(async (candidate) => {
      await ctx.stub.putState(
        candidate.id,
        Buffer.from(stringify(sortKeysRecursive(candidate)))
      )
      console.info(`Candidate ${candidate.id} intialized`)
    })
  }

  @Transaction()
  public async CreateCandidate(
    ctx: Context,
    id: string,
    name: string,
    partyId: string
  ): Promise<void> {
    const exists = await this.CandidateExists(ctx, id)

    if (exists) {
      throw new Error(`The candidate ${id} already exists`)
    }

    const candidate: Candidate = new Candidate(id, name, partyId)

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(candidate)))
    )
  }

  @Transaction(false)
  public async ReadCandidate(ctx: Context, id: string): Promise<string> {
    const candidateJSON = await ctx.stub.getState(id)

    if (!candidateJSON || candidateJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`)
    }

    return candidateJSON.toString()
  }

  @Transaction()
  public async UpdateCandidate(
    ctx: Context,
    id: string,
    name: string,
    partyId: string
  ): Promise<void> {
    const exists = await this.CandidateExists(ctx, id)

    if (!exists) {
      throw new Error(`The candidate ${id} does not exist`)
    }

    const candidate: Candidate = new Candidate(id, name, partyId)

    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(candidate)))
    )
  }

  @Transaction()
  public async DeleteCandidate(ctx: Context, id: string): Promise<void> {
    const exists = await this.CandidateExists(ctx, id)

    if (!exists) {
      throw new Error(`The candidate ${id} does not exist`)
    }

    return ctx.stub.deleteState(id)
  }

  @Transaction(false)
  @Returns('string')
  public async CandidateExists(ctx: Context, id: string): Promise<boolean> {
    const candidateJSON = await ctx.stub.getState(id)
    return candidateJSON && candidateJSON.length > 0
  }

  @Transaction(false)
  public async GetAllCandidates(ctx: Context): Promise<string> {
    const allCandidates = []

    const iterator = await ctx.stub.getStateByRange('', '')
    let result = await iterator.next()

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf-8'
      )

      let record: Candidate | string

      try {
        record = JSON.parse(strValue)
      } catch (error) {
        console.log(error)
        record = strValue
      }

      allCandidates.push(record)
      result = await iterator.next()
    }

    return JSON.stringify(allCandidates)
  }
}
