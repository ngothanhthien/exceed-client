import { defineStore } from 'pinia'
import { socket } from '@/socket'
import { emitAsync } from '@/core/helper.js'

// socket listeners
const AUTH_NEW = 'auth:new'

// socket events
const AUTH_LOGIN = 'auth:login'

export const useAccountStore = defineStore('accountStore', {
  /**
   * @return {{isLogged: boolean, account: Account | null}}
   */
  state: () => ({
    isLogged: false,
    account: null
  }),
  actions: {
    async bindEvents() {
      await this.login()
    },
    cleanUp() {
    },
    async login() {
      try {
        const _this = this
        this.account = await emitAsync(AUTH_LOGIN, _this.account?.name)
        this.isLogged = true
      } catch (e) {
        console.error(e)
      }
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['account']
  }
})
