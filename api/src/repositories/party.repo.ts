import Repository from "./repo";
import { v4 as uuidv4 } from "uuid";

export default class PartyRepository extends Repository {
  constructor() {
    super()
  }

  public async getAll() {
    try {
      const data = await super.submitTransaction('GetAllParties', 'admin')
      // console.log('Data:', data)
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string) {
    try {
      return await super.submitTransaction('ReadParty', null, id)
    } catch (error) {
      throw error;
    }
  }

  public async create(name: string) {
    try {
      const id = uuidv4()
      console.log(`Creating: ${name} with id: ${id}`)
      return await super.submitTransaction('CreateParty', null, id, name)
    } catch (error) {
      throw error
    }
  }

  public async update(id: string, name: string) {
    try {
      return await super.submitTransaction('UpdateParty', null, id, name)
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string) {
    try {
      return await super.submitTransaction('DeleteParty', null, id)
    } catch (error) {
      throw error;
    }
  }
}