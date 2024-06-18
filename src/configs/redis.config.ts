import { Redis } from 'ioredis'
import { envConfig } from './env.config'

export const REDIS = new Redis(envConfig.REDIS_PORT, envConfig.REDIS_HOST, {
  maxRetriesPerRequest: 1,
  lazyConnect: true
})

export const createConnectionRedis = () => {
  REDIS.connect()
    .then(() => console.log('connect redis successfully'))
    .catch((e) => {
      console.log('error', e)
    })
}

export const getRedis = () => {
  if (REDIS) return REDIS
  return null
}
