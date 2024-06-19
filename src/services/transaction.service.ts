import { PSQL } from '@/configs/db.config'
import { updateQueue } from '@/configs/queue.config'
import { getRedis } from '@/configs/redis.config'
import { SessionGame } from '@/entities/session_game.entity'
import { Transaction } from '@/entities/transaction.entity'
import { User } from '@/entities/user.entity'
import { Redis } from 'ioredis'
import Redlock from 'redlock'

class TransactionService {
  private redis: Redis
  private redlock: Redlock
  constructor() {
    this.redis = getRedis()
    this.redlock = new Redlock([this.redis], {
      driftFactor: 0.01, // Tỷ lệ trôi
      retryCount: 10, // Số lần thử lại
      retryDelay: 200, // Thời gian chờ giữa các lần thử lại
      retryJitter: 200 // Biến thiên ngẫu nhiên cho thời gian chờ
    })
  }

  async bet(xu_dat: number, selection: number, user: User) {
    const transaction = new Transaction()
    transaction.selection = selection
    transaction.xu_dat = xu_dat
    transaction.user = user
    await transaction.save()
    const lock = await this.redlock.acquire(['locks:session'], 1000)
    try {
      const sg: SessionGame = JSON.parse(await this.redis.get('session'))
      sg.coin += xu_dat
      await this.redis.set('session', JSON.stringify(sg))

      await updateQueue.add('updateSession', { sg })
    } catch (error) {
      throw error
    } finally {
      await lock.release()
    }

    return true
  }
}

export default TransactionService
