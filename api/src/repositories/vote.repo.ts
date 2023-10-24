import Repository from './repo'
import { v4 as uuidv4 } from 'uuid'

export default class VoteRepository {
  private readonly repo: Repository

  constructor() {
    this.repo = Repository.getInstance()
  }

  public async initialise(amount: number) {
    try {
      return await this.repo.submitTransaction(
        'vote',
        'DistributeTokens',
        amount.toString()
      )
    } catch (error) {
      throw error
    }
  }

  public async getUnusedTokens() {
    try {
      return await this.repo.submitTransaction('vote', 'GetUnusedTokens')
    } catch (error) {
      throw error
    }
  }

  public async getVoterBalance() {
    try {
      return await this.repo.submitTransaction('vote', 'GetVoterBalance')
      // return await this.repo.submitTransaction('vote', 'GetAllVoterBalances')
    } catch (error) {
      throw error
    }
  }

  public async getTotalSupply() {
    try {
      return await this.repo.submitTransaction('vote', 'GetTotalSupply')
    } catch (error) {
      throw error
    }
  }

  public async getAll() {
    try {
      return await this.repo.submitTransaction('vote', 'GetAllVotes')
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string) {
    try {
      return await this.repo.submitTransaction('vote', 'ReadVote', id)
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
        'Vote',
        id,
        timestamp,
        candidateId
      )
    } catch (error) {
      throw error
    }
  }
}
