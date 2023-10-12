import Repository from './repo'
import { v4 as uuidv4 } from 'uuid'

export default class PartyRepository extends Repository {
  constructor() {
    super()
  }

  public async getAll() {
    try {
      const data = await super.submitTransaction('party', 'GetAllParties')
      return data
    } catch (error) {
      throw error
    }
  }

  public async getById(id: string) {
    try {
      return await super.submitTransaction('party', 'ReadParty', id)
    } catch (error) {
      throw error
    }
  }

  public async create(name: string) {
    try {
      console.log(`Creating party with name: ${name}`)
      const id = uuidv4()
      return await super.submitTransaction('party', 'CreateParty', id, name)
    } catch (error) {
      throw error
    }
  }

  public async update(id: string, name: string) {
    try {
      return await super.submitTransaction('party', 'UpdateParty', id, name)
    } catch (error) {
      throw error
    }
  }

  public async delete(id: string) {
    try {
      return await super.submitTransaction('party', 'DeleteParty', id)
    } catch (error) {
      throw error
    }
  }
}
