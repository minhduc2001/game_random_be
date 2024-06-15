import { Redis } from 'ioredis'
import { Server, Socket } from 'socket.io'

const GAME_DURATION = 60 // 1 min
const PENDING_DURATION = 5 * 1000 // 5 s

class SocketService {
  private countdownInterval: NodeJS.Timeout
  private pendingTimeout: NodeJS.Timeout
  private countdown: number = GAME_DURATION
  private socket: Socket
  private redis: Redis

  constructor(io: Server) {
    this.redis = new Redis()
    io.on('connection', (socket: Socket) => {
      this.handleConnection(socket)
      this.socket = socket
      this.handleDisconnect(socket)
    })
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

    if (!this.countdownInterval) {
      this.startCountdown()
    }
  }

  handleDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      console.log('Client đã ngắt kết nối:', socket.id)
    })

    // if (Object.keys(this.server.sockets.connected).length === 0) {
    //   this.stopCountdown();
    // }
  }

  startCountdown() {
    clearInterval(this.countdownInterval)

    this.countdownInterval = setInterval(() => {
      this.countdown--

      if (this.countdown >= 0) {
        this.socket.emit('countdown', { time: this.countdown })
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

  private startPendingPhase() {
    this.socket.emit('pending')

    this.pendingTimeout = setTimeout(() => {
      this.countdown = GAME_DURATION
      this.socket.emit('countdown', { time: this.countdown })
      this.startCountdown()
    }, PENDING_DURATION)
  }
}

export default SocketService
