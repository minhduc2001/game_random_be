import dailyRotateFile from 'winston-daily-rotate-file'
import winston from 'winston'
import { envConfig } from '@/configs/env.config'
import chalk, { BackgroundColor } from 'chalk'
import * as path from 'path'
import { mkdirSync } from 'fs'

const logDir = path.join(process.cwd(), 'logs')
mkdirSync(logDir, { recursive: true })

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const level = (): string => {
  const node_env = envConfig.NODE_ENV || 'development'
  const isDevelopment = node_env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  //   winston.format.colorize({ level: true }),
  winston.format.printf((info: any) => {
    const c = String(Object.assign(colors)[info.level]) as typeof BackgroundColor
    const colorizedMessage = chalk[c](info.level)
    return `${info.timestamp} ${colorizedMessage}: ${info.message}`
  })
)

const dailyRotateFileTransport = new dailyRotateFile({
  filename: path.join(logDir, 'logs-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: `3d`
})

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }),
  //   new winston.transports.File({ filename: 'logs/all.log' }),
  dailyRotateFileTransport
]

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
})

export default logger
