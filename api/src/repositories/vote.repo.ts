import Repository from './repo'
import { v4 as uuidv4 } from 'uuid'

export default class VoteRepository {
  private readonly repo: Repository

  constructor() {
    this.repo = Repository.getInstance()
  }

  public async getAll() {
    try {
      return await this.repo.submitTransaction('vote', 'GetAllVotes', 'admin')
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string) {
    try {
      return await this.repo.submitTransaction('vote', 'ReadVote', 'admin', id)
    } catch (error) {
      throw error
    }
  }

  public async create(candidateId: string) {
    try {
      const id = uuidv4()
      const timestamp = Date.now().toString()

      return await this.repo.submitTransaction(
        'vote',
        'CreateVote',
        'admin',
        id,
        timestamp,
        candidateId
      )
    } catch (error) {
      throw error
    }
  }
}
