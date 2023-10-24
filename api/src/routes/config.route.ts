import express, { Router, Request, Response } from 'express'
import ResponseHelper from '../utils/helpers/response'

import * as fs from 'fs'
import * as path from 'path'
import ConfigHelper from '../utils/helpers/config'
import WalletHelper from '../utils/helpers/wallet'
import Repository from '../repositories/repo'
import { CcpConfig } from '../utils/types/ccp.type'
import VoteRepository from '../repositories/vote.repo'

const router: Router = express.Router()
const voteRepo = new VoteRepository()

router.get('/connection', async (req: Request, res: Response) => {
  try {
    const config = await ConfigHelper.getConfig()

    const returnObj = {
      channels: config.channels,
      selected: config.connection,
      organisations: config.organisations.map((item) => ({
        id: item.id,
        peers: Object.keys((item.connectionProfile as CcpConfig).peers),
      })),
    }

    ResponseHelper.successResponse(res, 200, returnObj)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/connection', (req: Request, res: Response) => {
  try {
    const { user, channel, organisation, peer } = req.body

    ConfigHelper.setConnectionDetails(user, channel, organisation, peer)

    ResponseHelper.successResponse(
      res,
      200,
      'Successfully updated the user configuration'
    )
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/identities', async (req: Request, res: Response) => {
  try {
    const wallets = await WalletHelper.getWallets()
    ResponseHelper.successResponse(res, 200, wallets)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/initialized', async (req: Request, res: Response) => {
  try {
    const config = await ConfigHelper.getConfig()

    ResponseHelper.successResponse(res, 200, {
      initialised: config.initialised,
    })
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/initialized', async (req: Request, res: Response) => {
  try {
    const { amount } = req.body
    const data = await voteRepo.initialise(amount)
    await ConfigHelper.initialise()
    console.log(req.body, data)

    ResponseHelper.successResponse(res, 200, 'Initialise')
  } catch (error) {
    console.log(error)
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

export default router
