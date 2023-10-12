import express, { Router, Request, Response } from 'express'

import VoteRepository from '../repositories/vote.repo'
import ResponseHelper from '../utils/helpers/response'
import CandidateRepo from '../repositories/candidate.repo'
import PartyRepository from '../repositories/party.repo'

const router: Router = express.Router()

const vRepo = new VoteRepository()
const cRepo = new CandidateRepo()
const pRepo = new PartyRepository()

router.get('/list', async (req: Request, res: Response) => {
  try {
    const candidates: any[] = (await cRepo.getAll()) as any[]
    const parties: any[] = (await pRepo.getAll()) as any[]

    console.log({ candidates, parties })

    const list = parties.flatMap((party) => {
      const partyCandidates = candidates.filter(
        (candidate) => candidate.partyId === party.id
      )
      return {
        name: party.name,
        candidates: partyCandidates.reduce((acc, candidate) => {
          acc[candidate.id] = candidate.name
          return acc
        }, {} as Record<string, string>),
      }
    })

    ResponseHelper.successResponse(res, 200, list)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const votes = await vRepo.getAll()
    ResponseHelper.successResponse(res, 200, votes)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vote = await vRepo.getById(req.params.id)
    ResponseHelper.successResponse(res, 200, vote)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.body

    const vote = await vRepo.create(candidateId)
    ResponseHelper.successResponse(res, 200, vote)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

export default router
