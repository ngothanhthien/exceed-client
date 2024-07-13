import { defineStore } from 'pinia'
import { socket } from '@/socket.js'
import axios from 'axios'

export const useGlobalAccountsStore = defineStore('globalAccount', {
  /**
   * @return {{accounts: Account[]}}
   */
  state: () => ({
    accounts: []
  }),
  actions: {
    async bindEvents() {
      const _this = this
      const res = await axios.get('/api/accounts')
      _this.accounts = res.data
      // trigger by other clients
      socket.on('auth:new', (account) => {
        if (!_this.isAccountLogged(account)) {
          _this.accounts.push(account)
        }
      })
    },
    async cleanUp() {
      socket.off('auth:new')
    },
    isAccountLogged(account) {
      const _this = this
      return _this.accounts.some((acc) => acc.id === account.id)
    }
  }
})
