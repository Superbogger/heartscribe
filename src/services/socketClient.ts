// src/socketClient.ts
import { io, Socket } from 'socket.io-client'

const URL = 'http://localhost:3003' // adjust to your backend

// Create the Socket.IO client
export const socket: Socket = io(URL)

export function connectSocket() {
  if (!socket.connected) {
    socket.connect()
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect()
  }
}

export function joinGuestbookRoom(publicId: string) {
  socket.emit('joinGuestbook', [publicId])
}

export function joinGuestbookRooms(publicId: string[]) {
  socket.emit('joinGuestbook', publicId)
}

export function leaveGuestBook(publicId: string[]) {
  console.log('executed leeave funciton')
  socket.emit('leaveGuestbook', publicId)
}

export function onSocketConnected(callback: (id: string) => void) {
  if (socket.connected && socket.id) {
    // Already connected, and id is known
    callback(socket.id)
  }

  socket.on('connect', () => {
    if (socket.id) {
      callback(socket.id)
    }
  })
}
