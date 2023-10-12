import express, { Router, Request, Response } from 'express'
import WalletHelper from '../utils/helpers/wallet'
import NetworkHelper from '../utils/helpers/network'

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
    const { userId, name, role } = req.body

    await WalletHelper.enrollUser(userId, name, role)
    res.status(200).json({ message: 'Successfully created a user' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/connect', async (req: Request, res: Response) => {
  try {
    const data = await NetworkHelper.connectToNetwork('dennis7')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
