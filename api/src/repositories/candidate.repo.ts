import { ICandidate } from '../utils/interfaces'
import Repository from './repo'
import { v4 as uuid4 } from 'uuid'

export default class CandidateRepo {
  private readonly repo: Repository

  constructor() {
    this.repo = Repository.getInstance()
  }

  public async getAll() {
    try {
      const candidates = await this.repo.submitTransaction(
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
      const candidate: ICandidate = (await this.repo.submitTransaction(
        'candidate',
        'ReadCandidate',
        id
      )) as ICandidate

      return candidate
    } catch (error) {
      throw error
    }
  }

  public async create(name: string, partyId: string) {
    try {
      const id = uuid4()

      return await this.repo.submitTransaction(
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
      return await this.repo.submitTransaction(
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
      return this.repo.submitTransaction('candidate', id)
    } catch (error) {
      throw error
    }
  }
}
