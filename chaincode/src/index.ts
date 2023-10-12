import { CandidateTransferContract } from './contracts/candidateTransfer'
import { PartyTransferContract } from './contracts/partyTransfer'
import { VoteTransferContract } from './contracts/voteTransfer'

export { CandidateTransferContract } from './contracts/candidateTransfer'
export { PartyTransferContract } from './contracts/partyTransfer'
export { VoteTransferContract } from './contracts/voteTransfer'

export const contracts: any[] = [
  PartyTransferContract,
  CandidateTransferContract,
  VoteTransferContract,
]
