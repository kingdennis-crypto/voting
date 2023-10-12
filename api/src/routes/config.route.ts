import express, { Router, Request, Response } from 'express'
import ResponseHelper from '../utils/helpers/response'

import * as fs from 'fs'
import * as path from 'path'
import ConfigHelper from '../utils/helpers/config'

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Config' })
})

router.post('/connection', (req: Request, res: Response) => {
  try {
    const { user, peer, organisation, channel } = req.body

    ConfigHelper.setConnectionDetails(user, peer, organisation, channel)

    ResponseHelper.successResponse(
      res,
      200,
      'Successfully updated the user configuration'
    )
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.post('/initialise', (req: Request, res: Response) => {
  try {
    const { userId } = req.body

    ConfigHelper.initialise(userId)
    ResponseHelper.successResponse(res, 200, 'Help! But in a good way')
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.get('/organisations', (req: Request, res: Response) => {
  try {
    const organisationsPath = path.resolve(
      process.env.FABRIC_PATH,
      'test-network',
      'organizations',
      'peerOrganizations'
    )

    const organisations = fs.readdirSync(organisationsPath)

    const responseObj = []

    organisations.forEach((organisation: string) => {
      const peerPath = path.resolve(organisationsPath, organisation, 'peers')
      const peers = fs.readdirSync(peerPath)

      responseObj.push({ organisation, peers })
    })

    ResponseHelper.successResponse(res, 200, responseObj)
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

export default router
