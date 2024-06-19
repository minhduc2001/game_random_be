import { PSQL } from '@/configs/db.config'
import { getRedis } from '@/configs/redis.config'
import { SessionGame } from '@/entities/session_game.entity'
import { Worker } from 'bullmq'

const updateWorker = new Worker(
  'updateQueue',
  async (job) => {
    const { sg } = job.data

    const queryRunner = PSQL.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      let sessionGame = await queryRunner.manager.findOne(SessionGame, { where: { id: sg.id } })
      if (!sessionGame) {
        sessionGame = new SessionGame()
        sessionGame.id = sg.ids
      }
      sessionGame.coin = sg.coin
      await queryRunner.manager.save(sessionGame)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  },
  { connection: getRedis() }
)
