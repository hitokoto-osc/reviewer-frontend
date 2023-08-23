import { useHTTP } from './useHTTP'

export interface UserInfoRes {
  id: number
  name: string
  email: string
  role: string
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
    type: number
    comment: string
    created_at: string
    updated_at: string
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
  }>
  created_at: string
  updated_at: string
}

export function useUserInfoReq() {
  return useHTTP.get<UserInfoRes>(`/user`)
}
