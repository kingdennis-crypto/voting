import { Property, Object } from 'fabric-contract-api'
import Party from './party'

@Object()
export default class Candidate {
  @Property()
  public id: string
  @Property()
  public name: string
  @Property()
  public partyId: string

  constructor(id: string, name: string, partyId: string) {
    this.id = id
    this.name = name
    this.partyId = partyId
  }
}
