import { IRepository } from "../utils/interfaces";
import Repository from "./repo";
import { v4 as uuid4 } from "uuid";

export default class CandidateRepo extends Repository implements IRepository {
  constructor() {
    super()
  }

  public async getAll() {
    try {
      return await super.submitTransaction('GetAllCandidates', null)
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string) {
    try {
      return await super.submitTransaction('ReadCandidate', null, id)
    } catch (error) {
      throw error
    }
  }

  public async create(name: string, partyId: string) {
    try {
      const id = uuid4()

      return await super.submitTransaction('CreateCandidate', null, id, name, partyId)
    } catch (error) {
      throw error
    }
  }
  
  public async update(id: string, name: string, partyId: string) {
    try {
      return await super.submitTransaction('UpdateCandidate', id, name, partyId)
    } catch (error) {
      throw error
    }
  }

  public async delete(id: string) {
    try {
      return super.submitTransaction(id, null)
    } catch (error) {
      throw error
    }
  }
}