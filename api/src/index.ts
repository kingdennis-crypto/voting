import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// Routes
import AuthRoutes from './routes/authentication'
import PartyRoutes from './routes/party.route'

const PORT = 5050

const APP: Application = express()

APP.use(bodyParser.urlencoded({ extended: true }))
APP.use(bodyParser.json())
APP.use(bodyParser.raw())

APP.use(cors())

APP.use('/authentication', AuthRoutes)
APP.use('/parties', PartyRoutes)

APP.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`)
})