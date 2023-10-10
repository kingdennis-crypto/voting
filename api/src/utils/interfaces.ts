export interface ICandidate {
  id: string
  name: string
  partyId: string
}

export interface IParty {
  id: string
  name: string
}

export interface IVote {
  id: string
  timestamp: string
  candidateId: string
}