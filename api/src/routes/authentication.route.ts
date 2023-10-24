import express, { Router, Request, Response } from 'express'
import WalletHelper from '../utils/helpers/wallet'
import ResponseHelper from '../utils/helpers/response'

const router: Router = express.Router()

router.post('/admin', async (req: Request, res: Response) => {
  try {
    await WalletHelper.enrollAdmin()

    res.status(200).json({
      message:
        'Successfully enrolled admin user "admin" and imported it into the wallet',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/user', async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body

    await WalletHelper.enrollUser(userId, role)
    ResponseHelper.successResponse(res, 200, 'Successfully created the user')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await WalletHelper.enrollUser(id, 'admin')
    ResponseHelper.successResponse(res, 200, 'Successfully created a user')
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await WalletHelper.deleteWallet(id)
    ResponseHelper.successResponse(res, 200, 'Successfully deleted the wallet')
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
})

export default router
