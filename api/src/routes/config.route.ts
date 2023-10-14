import express, { Router, Request, Response } from 'express'
import ResponseHelper from '../utils/helpers/response'

import * as fs from 'fs'
import * as path from 'path'
import ConfigHelper from '../utils/helpers/config'
import WalletHelper from '../utils/helpers/wallet'
import Repository from '../repositories/repo'
import { CcpConfig } from '../utils/types/ccp.type'

const router: Router = express.Router()

router.get('/connection', async (req: Request, res: Response) => {
  try {
    const config = await ConfigHelper.getConfig()

    const returnObj = {
      channels: config.channels,
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
    const { user, channel } = req.body

    ConfigHelper.setConnectionDetails(user, channel)

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

export default router
