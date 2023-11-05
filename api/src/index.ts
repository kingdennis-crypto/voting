import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import https from 'https'
import fs from 'fs'

// Routes
import AuthRoutes from './routes/authentication.route'
import PartyRoutes from './routes/party.route'
import ConfigRoutes from './routes/config.route'
import VoteRoutes from './routes/vote.route'
import CandidateRoutes from './routes/candidate.route'

const HTTP_PORT = 5050
const HTTPS_PORT = 5443

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

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
}

const server = https.createServer(options, APP)

server.listen(HTTPS_PORT, () => {
  console.log(`[HTTPS] Server is listening at port: ${HTTPS_PORT}`)
})

APP.listen(HTTP_PORT, () => {
  console.log(`[HTTP] Server is listening at port: ${HTTP_PORT}`)
})
