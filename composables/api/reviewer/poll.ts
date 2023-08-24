import { useHTTP } from './useHTTP'

export type PollMarkRes = {
  id: number
  text: string
  level: string
  property: number
  updated_at: string
  created_at: string
}[]

export function usePollMarks() {
  return useHTTP.get<PollMarkRes>('/poll/mark')
}

export interface PollListReq {
  status_start: number
  status_end: number
  with_records: boolean
  page: number
  page_size: number
}

export type PollListRes = {
  collection: Array<{
    id: number
    sentence_uuid: string
    sentence: {
      id: number
      uuid: string
      hitokoto: string
      type: string
      from: string
      from_who?: string
      creator: string
      creator_uid: number
      reviewer: number
      status: string
      poll_status: number
      created_at: string
    }
    status: number
    approve: number
    reject: number
    need_edited: number
    need_common_user_poll: number
    created_at: string
    updated_at: string
    marks: number[]
    polled_data?: {
      point: number
      method: number
      created_at: string
      updated_at: string
    }
    records: Array<{
      user_id: number
      point: number
      method: number
      comment: string
      created_at: string
      updated_at: string
    }>
  }>
  total: number
  page: number
  page_size: number
}

export function usePollList(req: PollListReq) {
  return useHTTP.get<PollListRes>('/poll', req)
}



export function doCreatePoll() {}
