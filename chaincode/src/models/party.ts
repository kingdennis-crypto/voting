import { Property, Object } from 'fabric-contract-api'

@Object()
export default class Party {
  @Property()
  public id: string
  @Property()
  public name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}
