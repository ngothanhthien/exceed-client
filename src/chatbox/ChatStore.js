import { defineStore } from 'pinia'
import { socket } from '@/socket.js'
import { EVENT_NAME } from '@/chatbox/constants.js'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: []
  }),
  actions: {
    addMessage(message) {
      this.messages.push(message)
    },
    bindEvents() {
      socket.on(EVENT_NAME.CONNECT, () => {
        socket.emit(EVENT_NAME.CHAT_LIST)
      })
      socket.on(EVENT_NAME.CHAT_LIST, (res) => {
        this.messages = res
      })
      socket.on(EVENT_NAME.CHAT_CREATED, (message) => {
        this.addMessage(message)
      })
    },
    cleanup() {
      // socket.off(EVENT_NAME.CONNECT)
      // socket.off(EVENT_NAME.CHAT_LIST)
      // socket.off(EVENT_NAME.CHAT_CREATED)
    },
    create(message) {
      this.addMessage(message)
      socket.emit(EVENT_NAME.CHAT_CREATE, message, (res) => {
        console.log(res)
      })
    }
  }
})
