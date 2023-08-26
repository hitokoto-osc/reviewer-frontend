import { MeiliSearch } from 'meilisearch'
import type { HitokotoType } from '@/enums/hitokoto'

let client: MeiliSearch | null = null

export function useSearchClient() {
  if (!client) {
    const config = useRuntimeConfig()
    client = new MeiliSearch({
      host: config.public.endpoint.searchAPI,
      apiKey: config.public.pubkey.searchAPI
    })
  }
  return client
}

export type SearchHitokotoParams = {
  sentence: string
  limit: number
  offset: number
}

export type SearchHitokotoResElement = {
  uuid: string
  hitokoto: string
  from_who?: string
  from: string
  creator: string
  creator_uid: number
  reviewer: number
  type: HitokotoType
  created_at: string
}

export function useSearchHitokoto(params: SearchHitokotoParams) {
  const client = useSearchClient()
  return client
    .index('sentences') // v1 句子集合
    .search<SearchHitokotoResElement>(
      params.sentence, // 查询参数
      {
        limit: params.limit,
        offset: params.offset
      }
    )
}
