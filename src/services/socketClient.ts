// src/socketClient.ts

// Create the Socket.IO client

// export function disconnectSocket() {
//   if (socket.connected) {
//     socket.disconnect()
//   }
// }

// export function joinGuestbookRoom(publicId: string) {
//   socket.emit('joinGuestbook', [publicId])
// }

// export function joinGuestbookRooms(publicId: string[]) {
//   socket.emit('joinGuestbook', publicId)
// }

// export function leaveGuestBook(publicId: string[]) {
//   console.log('executed leeave funciton')
//   socket.emit('leaveGuestbook', publicId)
// }

// export function onSocketConnected(callback: (id: string) => void) {
//   if (socket.connected && socket.id) {
//     // Already connected, and id is known
//     callback(socket.id)
//   }

//   socket.on('connect', () => {
//     if (socket.id) {
//       callback(socket.id)
//     }
//   })
// }
