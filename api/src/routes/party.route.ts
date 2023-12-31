import express, { Router, Request, Response } from 'express'

import PartyRepository from '../repositories/party.repo'
import ResponseHelper from '../utils/helpers/response'
import { requireHeaders } from '../utils/middleware/request.middleware'

const router: Router = express.Router()
const repo = new PartyRepository()

router.get('/', async (req: Request, res: Response) => {
  try {
    const parties = await repo.getAll()
    ResponseHelper.successResponse(res, 200, parties)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const party = await repo.getById(req.params.id)
    ResponseHelper.successResponse(res, 200, party)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    const party = await repo.create(name)
    ResponseHelper.successResponse(res, 200, party)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const paramID = req.params.id
    const { id, name } = req.body

    if (paramID !== id)
      return ResponseHelper.errorResponse(res, 500, "The ID's don't match")

    const party = await repo.update(paramID, name)
    ResponseHelper.successResponse(res, 200, party)
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
