import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4, type UUIDTypes } from 'uuid'

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
  // additional fields
  headerText: string
  footerText: string
  imageUrl: string //use default image if non set
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

    //USER
    guestBooks: [] as GuestBook[], // for adminloggedinview
    loggedIn: false, //frontend toggle, showing of deletion X's in the gallery
    userToken: '' as string, //elevated rights token
    currentUserName: '',
    //current one beeing viewed
    currentlyViewingGuestBook: {} as GuestBook | null,

    entryIDCounter: 0,
    currentPage: 'welcome' as GuestPage,

    //GUEST
    uuid: '', //standard uuid
    currentGuestName: '',

    //all entries
    currentViewingEntries: [] as Entry[],

    //guestentry -> computed
  }),

  //get computed properties  combine state + business logic
  getters: {
    ownsCurrentGuestbook(state): boolean {
      if (!state.loggedIn) return false
      return state.guestBooks.some((gb) => gb.id === state.currentlyViewingGuestBook!.id)
    },
  },

  //mutate state, api requests
  actions: {
    logout() {
      localStorage.removeItem('heartscribe_user_token')
      this.userToken = ''
      this.loggedIn = false
      this.currentUserName = ''
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
        imageUrl: '',
        date: this.getFormattedDate(),
      }
      this.currentViewingEntries.push(newEntry)
      return newEntry
    },

    isExistingGuestBookID(guestBookID: string): boolean {
      return this.guestBooks.some((gb) => gb.publicId === guestBookID)
    },

    init() {
      const saved = localStorage.getItem('wedding_guest_token')
      if (saved) {
        this.uuid = saved
      } else {
        this.uuid = uuidv4()
        localStorage.setItem('wedding_guest_token', this.uuid)
      }
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
