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
  options: HTTPOption<HitokotoAdminListRes> = {}
) {
  return useHTTP.get<HitokotoAdminListRes>('/admin/hitokoto', params, options)
}
