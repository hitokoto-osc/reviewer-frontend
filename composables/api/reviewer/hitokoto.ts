import { HitokotoStatus, HitokotoType } from '~/enums/hitokoto'
import { PollStatus } from '~/enums/poll'
import { Page } from './types'
import { HTTPOption, useHTTP } from './useHTTP'

export type HitokotoWithPoll = {
  id: number
  uuid: string
  hitokoto: string
  type: HitokotoType
  from: string
  from_who: string | null
  creator: string
  creator_uid: number
  reviewer: number
  commit_from: 'app' | 'web'
  status: HitokotoStatus
  created_at: string
  poll_status: PollStatus
}

export type GetHitokotoReq = never
export type GetHitokotoRes = HitokotoWithPoll

export function useHitokotoOne(
  uuid: string | Ref<string>,
  options: HTTPOption<GetHitokotoRes> = {
    key: `hitokoto-${toValue(uuid)}-${Date.now()}`
  }
) {
  return useHTTP.get('/hitokoto/' + toValue(uuid), {}, options)
}

export type HitokotoAdminListRes = Page<HitokotoWithPoll>
export type HitokotoAdminListReq = {
  page: number
  page_size: number
  order?: 'asc' | 'desc'
  status?: HitokotoStatus
  type?: HitokotoType
  from?: string
  from_who?: string
  creator?: string
  keywords?: string
  uuid?: string
}

export function useAdminHitokotoList(
  params: HitokotoAdminListReq | Ref<HitokotoAdminListReq>,
  options: HTTPOption<HitokotoAdminListRes> = {
    key: `hitokoto-list-${JSON.stringify(toValue(params))}-${Date.now()}`
  }
) {
  return useHTTP.get<HitokotoAdminListRes>('/admin/hitokoto', params, options)
}

export type HitokotoAdminUpdateReq = {
  hitokoto?: string
  type?: HitokotoType
  from?: string
  from_who?: string | null
  creator?: string
  creator_uid?: number
  reviewer?: number
  created_at?: string
  commit_from?: 'app' | 'web'
}
export type HitokotoAdminUpdateRes = never

export function doAdminUpdateHitokoto(
  uuid: string | Ref<string>,
  params: HitokotoAdminUpdateReq | Ref<HitokotoAdminUpdateReq>,
  options: HTTPOption<HitokotoAdminUpdateRes> = {
    key: `hitokoto-update-${toValue(uuid)}-${Date.now()}`
  }
) {
  return useHTTP.put('/admin/hitokoto/' + toValue(uuid), params, options)
}
