import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Tier {
  id: number
  rank: number //for sorting
  title: string // what the item is
}

export interface StoreInterface {
  count: number
  tierList: Tier[]
}

export interface SuperUser {
  id: number
  username: string
  password: string
}

export type Wedding = {
  blub: number
}

export const useStore = defineStore('mainStore', {
  state: () => ({
    count: 0,
    tierList: [],
  }),

  //get computet properties  combine state + business logic
  getters: {
    // sortedTList(state) {
    //   return [...state.tierList].sort((a, b) => b.rank - a.rank)
    // }
  },

  //mutate state, api requests
  actions: {},
})
