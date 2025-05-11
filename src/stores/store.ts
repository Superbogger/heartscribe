import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4, type UUIDTypes } from 'uuid'

export interface SuperUser {
  id: number //unique identifier for DB integration
  username: string
  password: string
}

export type GuestUser = {
  uuid: string
  name?: string
}

export type Entry = {
  entryID: number //unique identifier for DB integration
  imageUrl?: string //optional image
  comment: string //text
}

export type GuestEntry = GuestUser & Entry

//current page enum
export type GuestPage = 'welcome' | 'whois' | 'commit' | 'gallery'

export type Wedding = {
  blub: number
}

export const useStore = defineStore('mainStore', {
  state: () => ({
    userToken: '' as string,
    currentPage: 'welcome' as GuestPage,

    admin: {
      id: 0,
      username: 'admin',
      password: '123123',
    } as SuperUser,

    //all guests
    users: [] as GuestUser[],

    //all entries
    entries: [] as Entry[],

    //guestentry -> computed
  }),

  //get computed properties  combine state + business logic
  getters: {},

  //mutate state, api requests
  actions: {
    init() {
      const saved = localStorage.getItem('wedding_guest_token')
      this.userToken = saved || uuidv4()

      if (!saved) {
        localStorage.setItem('wedding_guest_token', this.userToken)
      }

      // Check if user already exists before pushing
      const exists = this.users.find((user) => user.uuid === this.userToken)
      if (!exists) {
        this.users.push({ uuid: this.userToken })
      }
    },

    attachNameToUser(nameOfUser: string) {
      const user = this.users.find((user) => user.uuid === this.userToken)

      if (user) {
        user.name = nameOfUser
        this.currentPage = 'commit'
      } else console.warn('User not found for current token')
    },

    goTo(page: GuestPage) {
      this.currentPage = page
    },

    reset() {
      localStorage.removeItem('wedding_guest_token')
      this.userToken = ''
      this.currentPage = 'welcome'
    },
  },
})
