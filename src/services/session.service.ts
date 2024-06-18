import { PSQL } from '@/configs/db.config'
import { SessionGame } from '@/entities/session_game.entity'

class SessionService {
  constructor() {}

  async getSessionActive() {
    return PSQL.createQueryBuilder(SessionGame, 'sg')
      .where('sg.active = :active', { active: true })
      .leftJoinAndSelect('sg.transaction', 't')
      .getOne()
  }

  async getSessionLatest() {
    return PSQL.createQueryBuilder(SessionGame, 'sg').orderBy('sg.id', 'DESC').limit(1).getOne()
  }

  async create(): Promise<SessionGame> {
    const sgLatest = await this.getSessionLatest()

    const sg = new SessionGame()
    sg.coin_prev = sgLatest?.coin ?? 0
    sg.coin_prev_total = sgLatest?.total_coin ?? 0

    return sg.save()
  }

  async getRes(): Promise<{ res_cl: string[]; res_tx: string[] }> {
    const data = await PSQL.createQueryBuilder(SessionGame, 'sg').orderBy('sg.id', 'DESC').limit(12).getMany()

    const res_cl: string[] = []
    const res_tx: string[] = []

    for (const d of data) {
      if (d.res_cl) res_cl.push('c')
      else res_cl.push('d')
      if (d.res_tx) res_tx.push('t')
      else res_tx.push('k')
    }

    return {
      res_cl,
      res_tx
    }
  }
}

export default SessionService
