import { Queue } from 'bullmq'
import { getRedis } from './redis.config'

export const updateQueue = new Queue('updateQueue', { connection: getRedis() })
