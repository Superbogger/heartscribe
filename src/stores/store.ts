import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import apiClient from '@/services/apiClient'
import { io, Socket } from 'socket.io-client'

const URL = 'http://localhost:3003' // adjust to your backend

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
  _id: string // unique ID (DB primary key)
  username: string
}

export interface GuestBook {
  _id: string // unique guestbook ID (internal)
  publicId: string // externally exposed, unguessable
  title: string
  userID: string //FK
  createdAt: Date
  isActive: boolean
  // additional fields
  headerText: string
  footerText: string
  imageUrl: string //use default image if non set
  entries: string[]
}

// 🧑‍💬 One guestbook entry
export interface GuestEntry {
  _id: string
  guestUUID: string
  name: string
  comment: string
  date: string // ISO string, backend returns Date as string
  imageUrl?: string
  guestBookId: string // matches _id of GuestBook
}

//current page enum
export type GuestPage = 'guest-landing' | 'welcome' | 'whois' | 'commit' | 'gallery'

export const useStore = defineStore('mainStore', {
  state: () => ({
    //USER
    guestBooks: [] as GuestBook[], // for adminloggedinview
    loggedIn: false, //frontend toggle, showing of deletion X's in the gallery
    userToken: '' as string, //elevated rights token
    currentUserName: '',
    //current one beeing viewed
    currentlyViewingGuestBook: {} as GuestBook | null,
    currentlyViewingGuestBookId: '' as string,

    entryIDCounter: 0,
    currentPage: null as GuestPage | null,

    //GUEST
    uuid: '', //standard uuid -> inserted at UserView_commit3.vue
    currentGuestName: '',

    //guestentry -> computed
    socket: io(URL) as Socket,
    socketId: '' as string,
  }),

  //get computed properties  combine state + business logic
  getters: {
    ownsCurrentGuestbook(state): boolean {
      if (!state.loggedIn) return false
      return state.guestBooks.some((gb) => gb._id === state.currentlyViewingGuestBook!._id)
    },

    isCurrentGBactive(state): boolean {
      const gb = state.currentlyViewingGuestBook
      if (!gb) return false //null guard

      return gb.isActive
    },

    isAllowedAccess(state): boolean {
      const gb = state.currentlyViewingGuestBook
      if (!gb) return false //null guard

      if (this.ownsCurrentGuestbook) {
        return true
      } //✅ owns it

      //does not own it, depending on active state now
      return gb.isActive
    },
  },

  //mutate state, api requests
  actions: {
    // SOCKET IO ---------------------------------------------------------------------------
    disconnectSocket() {
      if (this.socket && this.socket.connected) {
        this.socket.disconnect()
      }
    },

    joinGuestbookRoom(publicId: string) {
      if (this.socket && this.socket.connected) {
        this.socket.emit('joinGuestbook', [publicId])
      }
    },

    joinGuestbookRooms(publicIds: string[]) {
      if (this.socket && this.socket.connected) {
        this.socket.emit('joinGuestbook', publicIds)
      }
    },

    leaveGuestBook(publicIds: string[]) {
      if (this.socket && this.socket.connected) {
        console.log('➡️ leaveGuestBook called', publicIds)
        this.socket.emit('leaveGuestbook', publicIds)
      }
    },

    onSocketConnected(callback: (id: string) => void) {
      if (this.socket) {
        if (this.socket.connected && this.socket.id) {
          callback(this.socket.id)
        }
        this.socket.on('connect', () => {
          if (this.socket && this.socket.id) {
            callback(this.socket.id)
          }
        })
      }
    },

    connectSocket() {
      if (!this.socket.connected) {
        this.socket.connect()
      }
    },

    logout() {
      localStorage.removeItem('heartscribe_user_token')
      this.userToken = ''
      this.loggedIn = false
      this.currentUserName = ''
      const personalGuestBooksID = this.guestBooks.map((gb) => gb.publicId)
      this.leaveGuestBook(personalGuestBooksID)
    },

    registerCurrentlyViewing(publicId_new: string) {
      if (this.currentlyViewingGuestBookId) {
        this.leaveGuestBook([this.currentlyViewingGuestBookId])
      }

      this.joinGuestbookRoom(publicId_new)
      this.currentlyViewingGuestBookId = publicId_new
    },

    // SOCKET IO ---------------------------------------------------------------------------

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

    isExistingGuestBookID(guestBookID: string): boolean {
      return this.guestBooks.some((gb) => gb.publicId === guestBookID)
    },

    init() {
      this.onSocketConnected((id) => {
        this.socketId = id
      })
      const saved = localStorage.getItem('wedding_guest_token')
      if (saved) {
        this.uuid = saved
      } else {
        this.uuid = uuidv4()
        localStorage.setItem('wedding_guest_token', this.uuid)
      }
    },

    //---------------------------------------------------
    //METHODS THAT SHOULD BE CALLED WHEN USER IS LOGGED IN
    // - AdminLoggedInView
    async reAuth() {
      const token = localStorage.getItem('heartscribe_user_token')
      if (!token) return
      //reauth if page is beeing refreshed
      try {
        const res = await apiClient.get('/api/user/me')
        this.loggedIn = true
        this.currentUserName = res.data.name
      } catch {
        console.error('Error fetching token')
        localStorage.removeItem('heartscribe_user_token')
      }
    },

    //GuestView (root of all guestpages)
    async loadOwnedGuestbooks() {
      if (this.loggedIn) {
        try {
          const response = await apiClient.get('/api/guestbook')
          this.guestBooks = response.data
        } catch (err) {
          console.log('Error fetching guestbooks for user:' + this.currentUserName, err)
          localStorage.removeItem('heartscribe_user_token')
        }
      }
    },
    //---------------------------------------------------

    // THIS VARIANT CONSTITUTES A COMPOSITE LOCALSTORAGE ITEM (remember username)
    // init() {
    //   const raw = localStorage.getItem('wedding_guest_token')
    //   if (raw) {
    //     const parsed = JSON.parse(raw)
    //     this.uuid = parsed.uuid
    //     this.currentGuestName = parsed.name
    //   } else {
    //     this.uuid = uuidv4()
    //     this.currentGuestName = ''
    //     localStorage.setItem(
    //       'wedding_guest_token',
    //       JSON.stringify({
    //         uuid: this.uuid,
    //         name: this.currentGuestName,
    //       }),
    //     )
    //   }
    // },
    // attachNameToToken(name: string) {
    //   this.currentGuestName = name
    //   localStorage.setItem(
    //     'wedding_guest_token',
    //     JSON.stringify({
    //       uuid: this.uuid,
    //       name: this.currentGuestName,
    //     }),
    //   )
    // },

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
