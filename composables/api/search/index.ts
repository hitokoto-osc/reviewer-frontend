import { MeiliSearch } from 'meilisearch'
import type { SearchParams, SearchResponse } from 'meilisearch'
import type { HitokotoType } from '@/enums/hitokoto'
import type { AsyncDataOptions } from '#app'

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

export function useSearchHitokoto(
  params:
    | SearchHitokotoParams
    | (() => SearchHitokotoParams)
    | Ref<SearchHitokotoParams>,
  options: AsyncDataOptions<
    SearchResponse<SearchHitokotoResElement, SearchParams>
  > = {}
) {
  const param = unwrapT<SearchHitokotoParams>(params)
  const client = useSearchClient()
  return useAsyncData<SearchResponse<SearchHitokotoResElement, SearchParams>>(
    'search_hitokoto',
    () =>
      client
        .index('sentences') // v1 句子集合
        .search<SearchHitokotoResElement>(
          param.sentence, // 查询参数
          {
            limit: param.limit,
            offset: param.offset
          }
        ),
    options
  )
}
