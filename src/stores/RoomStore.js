import { defineStore } from 'pinia'
import { socket } from '@/socket'
import axios from 'axios'
import { useAccountStore } from '@/stores/AccountStore.js'
import { emitAsync } from '@/core/helper.js'

// socket listeners
const ROOM_UPDATE_STATE = 'room:update:state'

// socket events
const ROOM_CREATE = 'room:create'
const ROOM_JOIN = 'room:join'
const ROOM_LEAVE = 'room:leave'

export const useRoomStore = defineStore('room', {
  /**
   * @return {{list: Room[], current: Room | null}}
   */
  state: () => ({
    list: [],
    current: null
  }),
  actions: {
    async bindEvents() {
      await this.fetchList()
      await this.fetchCurrent()

      socket.on(ROOM_UPDATE_STATE, (room) => {
        const index = this.list.findIndex((r) => r.id === room.id)
        if (index !== -1) {
          this.list[index] = room
          this.updateCurrent(room)
        } else {
          this.list.push(room)
        }
      })
    },
    async cleanUp() {
      socket.off(ROOM_UPDATE_STATE)
    },
    async fetchList() {
      const res = await axios.get('/api/rooms')
      this.list = res.data
    },
    async fetchCurrent() {
      const account = useAccountStore()
      if (account.account) {
        const res = await axios.get(`/api/room/current`, {
          params: {
            account_id: account.account.id
          }
        })
        this.current = res.data
      }
    },
    async create() {
      try {
        /** @type {Room} */
        this.current = await emitAsync(ROOM_CREATE)
        return true
      } catch (error) {
        console.error(error)
      }

      return false
    },
    async join(roomId) {
      try {
        /** @type {Room} */
        this.current = await emitAsync(ROOM_JOIN, roomId)
        return true
      } catch (error) {
        console.error(error)
      }

      return false
    },
    async leaveRoom() {
      socket.emit(ROOM_LEAVE)
      this.current = null
    },
    updateCurrent(room) {
      if (this.current && this.current.id === room.id) {
        this.current = room
      }
    }
  }
})
