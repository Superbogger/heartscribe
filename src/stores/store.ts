import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4, type UUIDTypes } from 'uuid'

import img1 from '@/assets/debugImages/1.png'
import img2 from '@/assets/debugImages/2.png'
import img3 from '@/assets/debugImages/3.png'
import img4 from '@/assets/debugImages/4.png'
import img5 from '@/assets/debugImages/5.png'
import img6 from '@/assets/debugImages/6.png'

// SuperUser, GuestBook form a 1:N relationship
//SuperUser keeps track of guestbookIDs in guestbooksOwned
//a guestbook
export interface SuperUser {
  id: number // unique ID (DB primary key)
  username: string
  password: string // ideally hashed
  guestbooksOwned: number[] // array of GuestBook IDs
}

export interface GuestBook {
  id: number // unique guestbook ID
  title: string // e.g. "Manuela & Bogdan Wedding"
  superUserId: number // links to SuperUser.id
  createdAt: Date
  isActive: boolean // optional: for archiving / closing guestbooks
}

export type GuestUser = {
  uuid: string
  name?: string
}

export type Entry = {
  entryID: number //unique identifier for DB integration
  guestUUID: string
  imageUrl?: string //optional image
  comment: string //text
  date: string
}

export type GuestEntry = GuestUser & Entry & { guestBookId: number }

//current page enum
export type GuestPage = 'welcome' | 'whois' | 'commit' | 'gallery'

// export type Wedding = {
//   blub: number
// }

export const useStore = defineStore('mainStore', {
  state: () => ({
    //TODO Manage entries by guestBookID
    guestBookId: 0,
    entryIDCounter: 0,
    loggedIn: false,
    userToken: '' as string,
    currentPage: 'welcome' as GuestPage,

    admin: {
      id: 0,
      username: 'admin',
      password: '123123',
      guestbooksOwned: [],
    } as SuperUser,

    //all guests
    users: [] as GuestUser[],

    //all entries
    entries: [] as Entry[],

    //guestentry -> computed
  }),

  //get computed properties  combine state + business logic
  getters: {
    publishedGuestEntries(state): GuestEntry[] {
      return state.entries.map((entry) => {
        const user = state.users.find((u) => u.uuid === entry.guestUUID)
        return {
          ...entry,
          ...user, // merges `uuid` and optionally `name`
        } as GuestEntry
      })
    },
  },

  //mutate state, api requests
  actions: {
    // DEBUG: REMOVE
    getRandomDebugImage(): string {
      const images = [img1, img2, img3, img4, img5, img6]
      const index = Math.floor(Math.random() * images.length)
      return images[index]
    },

    getFormattedDate(): string {
      const date = new Date()

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0') // months are 0-based
      const year = date.getFullYear()

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day}.${month}.${year}, ${hours}:${minutes}`
    },

    generateEntryID(): number {
      return ++this.entryIDCounter
    },

    addEntry(comment: string): Entry {
      const newEntry: Entry = {
        entryID: this.generateEntryID(),
        guestUUID: this.userToken,
        comment: comment,
        imageUrl: this.getRandomDebugImage(), //DEBUG: replace with ''
        date: this.getFormattedDate(),
      }
      this.entries.push(newEntry)
      return newEntry
    },

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
