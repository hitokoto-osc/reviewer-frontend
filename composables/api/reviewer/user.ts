import { HTTPOption, useHTTP } from './useHTTP'
import type { UserRole } from '@/enums/user'
import type { HitokotoStatus, HitokotoType } from '@/enums/hitokoto'
import type { PollStatus, PollMethod } from '@/enums/poll'
export interface UserInfoRes {
  id: number
  name: string
  email: string
  role: UserRole
  poll: {
    points: {
      total: number
      approved: number
      rejected: number
      need_modify: number
    }
    count: number
    score: number
    adoption_rate: number
    created_at: string
    updated_at: string
  }
  poll_log?: Array<{
    poll_id: number
    point: number
    sentence_uuid: string
    type: PollMethod
    comment: string
    created_at: string
    updated_at: string
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
  }>
  created_at: string
  updated_at: string
}

export function useUserInfoReq(options: HTTPOption<UserInfoRes> = {}) {
  return useHTTP.get<UserInfoRes>(`/user`, {}, options)
}

export type UserUnreviewedCountRes = {
  count: number
}

export function useUserUnreviewedCount(
  options: HTTPOption<UserUnreviewedCountRes> = {}
) {
  return useHTTP.get<UserUnreviewedCountRes>(
    `/user/poll/unreviewed`,
    {},
    options
  )
}

export type UserPollLogsReq = {
  page?: number
  page_size?: number
  order: 'acs' | 'desc'
}

export type UserPollLogsRes = {
  collection: Array<{
    poll_id: number
    point: number
    sentence_uuid: string
    type: PollMethod
    comment: string
    created_at: string
    updated_at: string
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
    user_marks: number[]
  }>
  total: number
  page: number
  page_size: number
}

export function useUserPollLogs(
  params: UserPollLogsReq | Ref<UserPollLogsReq>,
  options: HTTPOption<UserPollLogsRes> = {}
) {
  return useHTTP.get<UserPollLogsRes>(`/user/poll/logs`, params, options)
}

export type UserScoreRecordsReq = {
  page?: number
  page_size?: number
  order: 'acs' | 'desc'
}

export type UserScoreRecordsRes = {
  collection: Array<{
    id: number
    poll_id: number
    user_id: number
    sentence_uuid: string
    score: number
    type: string
    reason: string
    updated_at: string
    created_at: string
  }>
  total: number
  page: number
  page_size: number
}

export function useUserScoreRecords(
  params: UserScoreRecordsReq | Ref<UserScoreRecordsReq>,
  options: HTTPOption<UserScoreRecordsRes> = {}
) {
  return useHTTP.get<UserScoreRecordsRes>(
    '/user/score/records',
    params,
    options
  )
}
