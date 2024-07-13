import { defineStore } from 'pinia'
import { socket } from '@/socket'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    isConnected: false
  }),

  actions: {
    bindEvents() {
      const _this = this
      socket.on('connect', () => {
        _this.isConnected = true
      })

      socket.on('disconnect', () => {
        _this.isConnected = false
      })
    },

    connect() {
      socket.connect()
    },

    disconnect() {
      socket.disconnect()
    }
  }
})
