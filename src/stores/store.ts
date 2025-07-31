import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { io, Socket } from 'socket.io-client'
import axios, { type AxiosInstance } from 'axios'

const URL = 'http://localhost:3003' // adjust to your backend

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
export type AppPage =
  | 'admin-login'
  | 'admin-panel'
  | 'guest-landing'
  | 'welcome'
  | 'whois'
  | 'commit'
  | 'gallery'

export const useStore = defineStore('mainStore', {
  state: () => ({
    //USER
    guestBooks: [] as GuestBook[], // for adminloggedinview
    loggedIn: false, //frontend toggle, showing of deletion X's in the gallery
    userToken: '' as string, //elevated rights token
    currentUserName: '',
    //current one beeing viewed
    currentlyViewingGuestBook: {} as GuestBook | null,
    currentlyViewingGuestBookId: '' as string, //needed for unregistering socket-IO room
    currentlyViewingGuestEntries: [] as GuestEntry[],

    entryIDCounter: 0,
    currentPage: 'admin-login' as AppPage,

    //GUEST
    uuid: '', //standard uuid -> inserted at UserView_commit3.vue
    currentGuestName: '',

    //guestentry -> computed

    socket: null as Socket | null,
    apiClient: null as AxiosInstance | null,
    isConnected: false,
  }),

  //get computed properties  combine state + business logic
  getters: {
    ownsCurrentGuestbook(state): boolean {
      if (!state.loggedIn) return false
      return state.guestBooks.some((gb) => gb._id === state.currentlyViewingGuestBook!._id)
    },

    //This computed builds a safe, full image URL for your guestbook header image
    computeImageURL(state): string {
      const img = state.currentlyViewingGuestBook?.imageUrl
      if (!img) return ''
      return img.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`
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
    setupWebSocketAndAPIClient() {
      this.socket = io(URL) //autoconnect

      this.socket.on('connect', () => {
        if (!this.socket) {
          console.error('Socket error on connection')
          return
        }

        // CRITICAL STEP: Create the Axios instance only AFTER we have the socket ID
        this.apiClient = axios.create({
          baseURL: 'http://localhost:3001/',
          headers: {
            'Content-Type': 'application/json',
            'x-socket-id': this.socket.id,
          },
        })

        this.apiClient.interceptors.request.use((config) => {
          const token = localStorage.getItem('heartscribe_user_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        })

        this.isConnected = true
      })

      this.socket.on('disconnect', () => {
        console.log('Socket.IO connection lost.')
        this.isConnected = false
      })

      // --- CLEAN EVENT LISTENERS ---

      //ENTRY CREATE
      this.socket.on('guestentry:created', (data) => {
        console.log("'create' Entry event received:", data)
        this.handleEntryCreate(data)
      })

      //ENTRY DELETE
      this.socket.on('guestentry:deleted', (data) => {
        console.log("'delete' Entry event received:", data)
        this.handleEntryDelete(data)
      })

      //GUESTBOOK DELETE
      this.socket.on('guestbook:deleted', (data) => {
        console.log('Guestbook delete-event received:', data)
        this.handleGuestBookDelete(data)
      })

      this.socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message)
      })
    },

    //apiNote: dually purposed REST + SocketIO broadcastreceiver
    handleEntryCreate(guestEntry: GuestEntry) {
      this.currentlyViewingGuestEntries.push(guestEntry)
    },

    //apiNote: dually purposed REST + SocketIO broadcastreceiver
    handleEntryDelete(guestEntryID_deleted: string) {
      this.currentlyViewingGuestEntries = this.currentlyViewingGuestEntries.filter(
        (e) => e._id !== guestEntryID_deleted,
      )
    },

    handleGuestBookDelete(guestbookID_deleted: string) {
      if (guestbookID_deleted !== this.currentlyViewingGuestBookId) {
        console.warn('Delete event for unrelated guestbook, ignoring')
        return
        //a watcher redirects us to the guest landing Page (see GuestView.vue)
      }
      this.currentlyViewingGuestBook = null //triggers the watcher in GuestView
      this.currentlyViewingGuestEntries = [] as GuestEntry[]
    },

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

    leaveGuestBook(publicIds: string[]) {
      if (this.socket && this.socket.connected) {
        console.log('➡️ leaveGuestBook called', publicIds)
        this.socket.emit('leaveGuestbook', publicIds)
      }
    },

    logout() {
      localStorage.removeItem('heartscribe_user_token')
      this.userToken = ''
      this.loggedIn = false
      this.currentUserName = ''
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

    async init() {
      this.setupWebSocketAndAPIClient()

      const saved = localStorage.getItem('wedding_guest_token')
      if (saved) {
        this.uuid = saved
      } else {
        this.uuid = uuidv4()
        localStorage.setItem('wedding_guest_token', this.uuid)
      }
    },

    async waitForApiClientReady() {
      while (!this.apiClient) {
        await new Promise((resolve) => setTimeout(resolve, 100))
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
        await this.waitForApiClientReady()

        const res = await this.apiClient!.get('/api/user/me')
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
          await this.waitForApiClientReady()

          const response = await this.apiClient!.get('/api/guestbook')
          this.guestBooks = response.data
        } catch (err) {
          console.log('Error fetching guestbooks for user:' + this.currentUserName, err)
          localStorage.removeItem('heartscribe_user_token')
        }
      }
    },

    goTo(page: AppPage) {
      this.currentPage = page
    },
  },
})
