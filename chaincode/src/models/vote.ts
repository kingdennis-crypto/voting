import { Property, Object } from 'fabric-contract-api'

@Object()
export default class Vote {
  @Property()
  public id: string
  @Property()
  public timestamp: string
  @Property()
  public candidateId: string

  constructor(id: string, timestamp: string, candidateId: string) {
    this.id = id
    this.timestamp = timestamp
    this.candidateId = candidateId
  }
}
