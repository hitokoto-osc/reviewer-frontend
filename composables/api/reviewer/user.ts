import { useHTTP } from './useHTTP'
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

export function useUserInfoReq() {
  return useHTTP.get<UserInfoRes>(`/user`)
}
