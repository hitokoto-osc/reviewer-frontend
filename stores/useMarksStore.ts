import type { PollMarkRes } from '~/composables/api/reviewer/poll'
import { PollMarkColor, PollMarkLevel } from '@/enums/poll'
export interface MarkMap {
  [key: number]: {
    text: string
    property: number
    color: PollMarkColor
  }
}

interface MarksState {
  marks: PollMarkRes
  lastUpdated: number
}

export const useMarksStore = defineStore('marks', {
  state: () => {
    return {
      marks: [],
      lastUpdated: 0
    } as MarksState
  },
  getters: {
    markColorMap(state) {
      const map: MarkMap = {}
      state.marks.forEach((mark) => {
        map[mark.id] = {
          text: mark.text,
          property: mark.property,
          color:
            mark.level == PollMarkLevel.Info
              ? PollMarkColor.Info
              : mark.level == PollMarkLevel.Danger
              ? PollMarkColor.Danger
              : PollMarkColor.Warning
        }
      })
      return map
    }
  },
  actions: {
    /**
     * @description: 获取标记列表
     */
    async $refresh() {
      const { data, error } = await usePollMarks({
        lazy: true
      })
      if (error.value) throw error.value
      if (data.value) this.marks = data.value.data
    },
    $setMarks(marks: PollMarkRes) {
      this.marks = marks
    }
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})
