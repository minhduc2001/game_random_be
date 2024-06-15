import express, { Express } from 'express'
import 'reflect-metadata'
import cors from 'cors'
import helmet from 'helmet'
import morganMiddleware from './middlewares/morgan.middleware'
import '@/utils/response'
import * as bodyParser from 'body-parser'
import routes from './routes/router'
import logger from '@/configs/logger.config'
import { envConfig } from './configs/env.config'
import exceptionFilter from './middlewares/exception.filter'
import { createConnection } from './configs/db.config'
import http from 'http'
import { initWebSocket } from './configs/socket.config'
import SocketService from './services/socket.service'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

const app: Express = express()
const port = envConfig.PORT || 3000
app.use(
  cors({
    origin: '*'
  })
)

app.use(helmet())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.use(morganMiddleware)
app.use('/api', routes)
app.use(exceptionFilter)
app.use('/apidoc', swaggerUi.serve)
app.get('/apidoc', swaggerUi.setup(swaggerDocument))

const server = http.createServer(app)
const io = initWebSocket(server)
new SocketService(io)

createConnection()

server.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`)
})
