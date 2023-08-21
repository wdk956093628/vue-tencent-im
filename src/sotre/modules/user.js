import { defineStore } from 'pinia'

export const useUserStore = defineStore('useUserStore', {
  state: () => ({
    defaultAvatar: '../../../src/assets/images/user.png',
    username: '',
  })
})