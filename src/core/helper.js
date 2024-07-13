import { socket } from '@/socket.js'

export const emitAsync = (event, ...args) => {
  return new Promise((resolve, reject) => {
    socket.emit(event, ...args, (response) => {
      if (response.success) {
        resolve(response.data)
      } else {
        reject(response.message)
      }
    })
  })
}
