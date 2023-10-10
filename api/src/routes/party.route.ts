import express, { Router, Request, Response } from 'express'
import NetworkHelper from '../utils/helpers/network';
import PartyRepository from '../repositories/party.repo';

const router: Router = express.Router();
const repo = new PartyRepository();

router.get('/', async (req: Request, res: Response) => {
  try {
    // const network = await NetworkHelper.connectToNetwork('dennis7');
    const parties = await repo.getAll();
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: error.message, ...error })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const party = await repo.create("Party test");
    res.status(200).json(party)
  } catch (error) {
    res.status(500).json({ message: error.message, ...error })
  }
})

export default router;