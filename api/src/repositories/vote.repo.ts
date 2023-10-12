import Repository from './repo'
import { v4 as uuidv4 } from 'uuid'

export default class VoteRepository extends Repository {
  constructor() {
    super()
  }

  public async getAll() {
    try {
      return await super.submitTransaction('vote', 'GetAllVotes', 'admin')
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string) {
    try {
      return await super.submitTransaction('vote', 'ReadVote', 'admin', id)
    } catch (error) {
      throw error
    }
  }

  public async create(candidateId: string) {
    try {
      const id = uuidv4()
      const timestamp = Date.now().toString()

      return await super.submitTransaction(
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

  public async delete(id: string) {
    try {
      return await super.submitTransaction('vote', 'DeleteVote', 'admin', id)
    } catch (error) {
      throw error
    }
  }
}
