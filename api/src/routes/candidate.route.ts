import express, { Request, Response, Router } from 'express'
import ResponseHelper from '../utils/helpers/response'
import CandidateRepo from '../repositories/candidate.repo'

const router: Router = express.Router()
const repo = new CandidateRepo()

router.get('/', async (req: Request, res: Response) => {
  try {
    const candidates = await repo.getAll()
    ResponseHelper.successResponse(res, 200, candidates)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const candidate = await repo.getById(req.params.id)
    ResponseHelper.successResponse(res, 200, candidate)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, partyId } = req.body

    const candidate = await repo.create(name, partyId)
    ResponseHelper.successResponse(res, 200, candidate)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const paramdID = req.params.id
    const { id, name, partyId } = req.body

    if (paramdID !== id)
      return ResponseHelper.errorResponse(res, 500, "The ID's don't match")

    const candidate = await repo.update(paramdID, name, partyId)
    ResponseHelper.successResponse(res, 200, candidate)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await repo.delete(req.params.id)
    ResponseHelper.successResponse(res, 500, 'Successfully deleted the party')
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

export default router
