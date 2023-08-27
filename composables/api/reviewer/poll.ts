import { HTTPOption, useHTTP } from './useHTTP'
import type { HitokotoStatus, HitokotoType } from '@/enums/hitokoto'
import type { PollMethod, PollStatus, PollMarkLevel } from '@/enums/poll'

export type PollMarkRes = {
  id: number
  text: string
  level: PollMarkLevel
  property: number
  updated_at: string
  created_at: string
}[]

export function usePollMarks(options: HTTPOption<PollMarkRes> = {}) {
  return useHTTP.get<PollMarkRes>('/poll/mark', {}, options)
}

export interface PollListReq {
  status_start: PollStatus
  status_end: PollStatus
  with_records: boolean
  page: number
  page_size: number
}

export type PollListCollectionElement = {
  id: number
  sentence_uuid: string
  sentence: {
    id: number
    uuid: string
    hitokoto: string
    type: HitokotoType
    from: string
    from_who?: string
    creator: string
    creator_uid: number
    reviewer: number
    status: HitokotoStatus
    poll_status: PollStatus
    created_at: string
  }
  status: PollStatus
  approve: number
  reject: number
  need_edited: number
  need_common_user_poll: number
  created_at: string
  updated_at: string
  marks: number[]
  polled_data?: {
    point: number
    method: PollMethod
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
}

export type PollListRes = {
  collection: Array<PollListCollectionElement>
  total: number
  page: number
  page_size: number
}

export function usePollList(
  req: PollListReq | Ref<PollListReq>,
  options: HTTPOption<PollListRes> = {}
) {
  return useHTTP.get<PollListRes>('/poll', req, options)
}

export type CreatePollRes = {
  poll: {
    id: number
    sentence_uuid: string
    sentence: {
      id: number
      uuid: string
      hitokoto: string
      type: HitokotoType
      from: string
      from_who: string
      creator: string
      creator_uid: number
      reviewer: number
      status: HitokotoStatus
      poll_status: PollStatus
      created_at: string
    }
    status: PollStatus
    approve: number
    reject: number
    need_edited: number
    need_common_user_poll: number
    created_at: string
    updated_at: string
  }
  remain_pending: number
}

export function doCreatePoll(options: HTTPOption<CreatePollRes> = {}) {
  return useHTTP.post<CreatePollRes>('/poll', {}, options)
}

export type PollReq = {
  method: PollMethod
  mark_ids?: number[]
  comment?: string
}

export interface PollRes {}

export function doPoll(
  pollID: number,
  req: PollReq,
  options: HTTPOption<PollRes> = {}
) {
  return useHTTP.put<PollRes>(`/poll/${pollID}`, req, options)
}

export interface PollCancelRes {}

export function doCancelPoll(
  pollID: number,
  options: HTTPOption<PollCancelRes> = {}
) {
  return useHTTP.delete<PollCancelRes>(`/poll/${pollID}/cancel`, {}, options)
}

export type PollDetailReq = {
  with_polled_data?: boolean
}

export type PollDetailRes = PollListCollectionElement

export function usePollDetail(
  pollID: number,
  req: PollDetailReq = {},
  options: HTTPOption<PollDetailRes> = {}
) {
  return useHTTP.get<PollDetailRes>(`/poll/${pollID}`, req, options)
}
