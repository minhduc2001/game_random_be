import { Server } from 'http'
import { Server as SocketIO } from 'socket.io'

let io: SocketIO

export const initWebSocket = (server: Server) => {
  io = new SocketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
  return io
}

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

export const sendMessageToAll = (message: string) => {
  if (io) {
    io.emit('message', message)
  }
}
