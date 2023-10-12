import { ICandidate } from '../utils/interfaces'
import Repository from './repo'
import { v4 as uuid4 } from 'uuid'

export default class CandidateRepo extends Repository {
  constructor() {
    super()
  }

  public async getAll() {
    try {
      const candidates = await super.submitTransaction(
        'candidate',
        'GetAllCandidates'
      )
      return candidates
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string): Promise<ICandidate> {
    try {
      return (await super.submitTransaction(
        'candidate',
        'ReadCandidate',
        id
      )) as ICandidate
    } catch (error) {
      throw error
    }
  }

  public async create(name: string, partyId: string) {
    try {
      const id = uuid4()

      return await super.submitTransaction(
        'candidate',
        'CreateCandidate',
        id,
        name,
        partyId
      )
    } catch (error) {
      throw error
    }
  }

  public async update(id: string, name: string, partyId: string) {
    try {
      return await super.submitTransaction(
        'candidate',
        'UpdateCandidate',
        id,
        name,
        partyId
      )
    } catch (error) {
      throw error
    }
  }

  public async delete(id: string) {
    try {
      return super.submitTransaction('candidate', id)
    } catch (error) {
      throw error
    }
  }
}
