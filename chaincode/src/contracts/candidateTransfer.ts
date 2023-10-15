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
import AuthorizationHelper from '../utils/helpers/authorization'

@Info({
  title: 'CandidateTransfer',
  description: 'Smart contract for the management of candidates',
})
export class CandidateTransferContract extends Contract {
  @Transaction()
  public async CreateCandidate(
    ctx: Context,
    id: string,
    name: string,
    partyId: string
  ): Promise<string> {
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

    id = `c-${id}`

    const exists = await this.CandidateExists(ctx, id)

    if (exists) {
      throw new Error(`The candidate ${id} already exists`)
    }

    const candidate: Candidate = { id, name, partyId }
    const payload = Buffer.from(stringify(sortKeysRecursive(candidate)))

    await ctx.stub.putState(id, payload)
    ctx.stub.setEvent('CreateCandidateEvent', payload)

    return JSON.stringify(candidate)
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
  ): Promise<string> {
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

    const exists = await this.CandidateExists(ctx, id)

    if (!exists) {
      throw new Error(`The candidate ${id} does not exist`)
    }

    // const candidate: Candidate = new Candidate(id, name, partyId)
    const candidate: Candidate = { id, name, partyId }
    const payload = Buffer.from(stringify(sortKeysRecursive(candidate)))

    ctx.stub.putState(id, payload)
    ctx.stub.setEvent('UpdateCandidateEvent', payload)

    return JSON.stringify(candidate)
  }

  @Transaction()
  public async DeleteCandidate(ctx: Context, id: string) {
    if (!AuthorizationHelper.isAdmin(ctx.clientIdentity))
      throw new Error('Only an admin can create a party')

    const exists = await this.CandidateExists(ctx, id)

    if (!exists) {
      throw new Error(`The candidate ${id} does not exist`)
    }

    const candidate = this.ReadCandidate(ctx, id)
    const payload = Buffer.from(stringify(sortKeysRecursive(candidate)))

    await ctx.stub.deleteState(id)
    ctx.stub.setEvent('DeleteCandidateEvent', payload)

    return JSON.stringify(candidate)
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

    const iterator = await ctx.stub.getStateByRange('c-', 'c-~')
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
