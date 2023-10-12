import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// Routes
import AuthRoutes from './routes/authentication.route'
import PartyRoutes from './routes/party.route'
import ConfigRoutes from './routes/config.route'
import VoteRoutes from './routes/vote.route'
import CandidateRoutes from './routes/candidate.route'

const PORT = 5050

const APP: Application = express()

APP.use(bodyParser.urlencoded({ extended: true }))
APP.use(bodyParser.json())
APP.use(bodyParser.raw())

APP.use(cors({ origin: '*' }))

APP.use('/authentication', AuthRoutes)
APP.use('/parties', PartyRoutes)
APP.use('/candidates', CandidateRoutes)
APP.use('/votes', VoteRoutes)
APP.use('/config', ConfigRoutes)

APP.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`)
})