import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4, type UUIDTypes } from 'uuid'

import img1 from '@/assets/debugImages/1.png'
import img2 from '@/assets/debugImages/2.png'
import img3 from '@/assets/debugImages/3.png'
import img4 from '@/assets/debugImages/4.png'
import img5 from '@/assets/debugImages/5.png'
import img6 from '@/assets/debugImages/6.png'

//STORE THESE THINGS IN PINIA  + owned GUESTBOOKS [] +  ENTRIES[] within selected guestbook

// userToken / guestUUID	Stored in localStorage, unique per guest
// currentPage	Navigation state (welcome, commit…)
// loggedIn	Admin login session
// inputName, inputComment	Temporary input fields
// guestBookId	Comes from the route, reused via store

// SuperUser, GuestBook form a 1:N relationship
//SuperUser keeps track of guestbookIDs in guestbooksOwned
//a guestbook
export interface User {
  id: number // unique ID (DB primary key)
  username: string
  password: string // ideally hashed
  guestbooksOwned: number[] // array of GuestBook IDs
}

export interface GuestBook {
  id: number // unique guestbook ID (internal)
  publicId: string // externally exposed, unguessable
  title: string
  userID: number
  createdAt: Date
  isActive: boolean
}

export type GuestUser = {
  guestUUID: string
  name: string
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
export type GuestPage = 'guest-landing' | 'welcome' | 'whois' | 'commit' | 'gallery'

// export type Wedding = {
//   blub: number
// }

export const useStore = defineStore('mainStore', {
  state: () => ({
    //TODO Manage entries by guestBookID

    // guestBooks: [] as GuestBook[], // all existing guestbooks
    //frontend need to cache all ID#s for further access (however superuser:guestbooks is 1:N)

    guestBooks: [] as GuestBook[],

    //current one beeing viewed
    guestBookId: 0,
    entryIDCounter: 0,
    currentPage: 'welcome' as GuestPage,

    //current user
    currentUserName: '',
    loggedIn: false,
    userToken: '' as string,

    currentlyViewingGuestBook: {} as GuestBook | null,

    //all guests
    users: [] as GuestUser[],

    //all entries
    entries: [] as Entry[],

    //guestentry -> computed
  }),

  //get computed properties  combine state + business logic
  getters: {
    //TODO
    // publishedEntriesPerGuestBook(state): GuestEntry[] | null {
    //   return null
    // },
  },

  //mutate state, api requests
  actions: {
    logout() {
      localStorage.removeItem('heartscribe_user_token')
      this.userToken = ''
      this.loggedIn = false
      this.currentUserName = ''
    },

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

    isExistingGuestBookID(guestBookID: number): boolean {
      return this.guestBooks.some((gb) => gb.id === guestBookID)
    },

    init() {
      //UUID
      const saved = localStorage.getItem('wedding_guest_token')
      this.userToken = saved || uuidv4()

      if (!saved) {
        localStorage.setItem('wedding_guest_token', this.userToken)
      }

      //JWT Token
      const savedToken = localStorage.getItem('heartscribe_admin_token')
      if (savedToken) {
        this.loggedIn = true
        this.userToken = savedToken
      }
    },

    attachNameToUser(nameOfUser: string) {
      const user = this.users.find((user) => user.guestUUID === this.userToken)

      if (user) {
        user.name = nameOfUser
        this.currentPage = 'commit'
      } else console.warn('User not found for current token')
    },

    goTo(page: GuestPage) {
      this.currentPage = page
    },

    reset() {
      localStorage.removeItem('heartscribe_user_token')
      this.userToken = ''
      this.currentPage = 'welcome'
    },
  },
})
