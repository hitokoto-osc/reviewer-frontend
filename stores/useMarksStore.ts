import type { PollMarkRes } from '~/composables/api/reviewer/poll'
export interface MarkMap {
  [key: number]: {
    text: string
    property: number
    color: string
  }
}

interface MarksState {
  marks: PollMarkRes
  markColorMap: MarkMap
  lastUpdated: number
}

export const useMarksStore = defineStore('marks', {
  state: () => {
    return {
      marks: [],
      markColorMap: {},
      lastUpdated: 0
    } as MarksState
  },
  getters: {},
  actions: {},
  persist: true
})
