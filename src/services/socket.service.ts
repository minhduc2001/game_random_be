import { envConfig } from '@/configs/env.config'
import { getRedis } from '@/configs/redis.config'
import { Redis } from 'ioredis'
import { Server, Socket } from 'socket.io'
import SessionService from './session.service'
import { SessionGame } from '@/entities/session_game.entity'
import { PSQL } from '@/configs/db.config'

const GAME_DURATION = 60 // 1 min
const PENDING_DURATION = 5 * 1000 // 5 s

class SocketService {
  private countdownInterval: NodeJS.Timeout
  private pendingTimeout: NodeJS.Timeout
  private countdown: number = GAME_DURATION
  private socket: Socket
  private redis: Redis
  private sessionService: SessionService
  private sessionGame: SessionGame
  private res_cl: string[]
  private res_tx: string[]

  constructor(io: Server) {
    io.on('connection', (socket: Socket) => {
      this.handleConnection(socket)
      this.socket = socket
      this.handleDisconnect(socket)
    })

    this.redis = getRedis()
    this.sessionService = new SessionService()
  }

  getCountdown(): number {
    return this.countdown
  }

  isCountdownRunning(): boolean {
    return !!this.countdownInterval
  }

  handleConnection(socket: Socket) {
    console.log('Client đã kết nối:', socket.id)
    socket.emit('countdown', { time: this.countdown })
    socket.emit('res', { res_cl: this.res_cl, res_tx: this.res_tx })

    if (!this.countdownInterval) {
      this.startCountdown()
    }
  }

  handleDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('Client đã ngắt kết nối:', socket.id)
    })
  }

  async startCountdown() {
    const [session, res] = await Promise.all([this.sessionService.getSessionActive(), this.sessionService.getRes()])
    this.sessionGame = session
    this.res_cl = res.res_cl
    this.res_tx = res.res_tx

    this.socket.emit('res', { res_cl: this.res_cl, res_tx: this.res_tx })

    if (!this.sessionGame) {
      this.sessionGame = await this.sessionService.create()
    }
    this.redis.set('session', JSON.stringify(this.sessionGame))

    clearInterval(this.countdownInterval)

    this.countdownInterval = setInterval(() => {
      this.countdown--

      if (this.countdown >= 0) {
        if (this.countdown == 13) {
          this.sessionGame.coin_random = Math.floor(Math.random() * 1000000) + 1000000
          this.redis.set('countdown', JSON.stringify(this.sessionGame))
        }
        this.socket.emit('countdown', { time: this.countdown, data: this.sessionGame })
        clearTimeout(this.pendingTimeout)
      } else {
        this.startPendingPhase()
        clearInterval(this.countdownInterval)
      }
    }, 1000)
  }

  private stopCountdown() {
    clearInterval(this.countdownInterval)
    this.countdownInterval = null
  }

  private async startPendingPhase() {
    this.socket.emit('pending')

    const temp: SessionService = JSON.parse(await this.redis.get('countdown'))
    const session_game = PSQL.getRepository(SessionGame).create({ ...temp })

    session_game.setTotalCoin()
    session_game.active = false
    session_game.setResCoin()
    await session_game.save()

    if (session_game.res_cl) this.res_cl.push('c')
    else this.res_cl.push('d')
    if (session_game.res_tx) this.res_tx.push('t')
    else this.res_tx.push('k')

    this.socket.emit('countdown', { time: this.countdown, data: session_game })
    this.socket.emit('res', { res_cl: this.res_cl, res_tx: this.res_tx })

    this.pendingTimeout = setTimeout(() => {
      this.countdown = GAME_DURATION
      this.startCountdown()
    }, PENDING_DURATION)
  }
}

export default SocketService
