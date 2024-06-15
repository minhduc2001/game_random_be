import morgan, { StreamOptions } from 'morgan'
import logger from '@/configs/logger.config'
import { envConfig } from '@/configs/env.config'

const stream: StreamOptions = {
  write: (message: string) => logger.http(message)
}

const skip = () => {
  const env = envConfig.NODE_ENV || 'development'
  return env !== 'development'
}

const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip
})

export default morganMiddleware
