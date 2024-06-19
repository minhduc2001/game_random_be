import { Redis } from 'ioredis'
import { envConfig } from './env.config'

export const REDIS = new Redis(envConfig.REDIS_PORT, envConfig.REDIS_HOST, {
  maxRetriesPerRequest: 1,
  lazyConnect: true
})

let connected = false

export const createConnectionRedis = async () => {
  await REDIS.connect()
  connected = true
}

export const getRedis = () => {
  if (connected) return REDIS
  return null
}
