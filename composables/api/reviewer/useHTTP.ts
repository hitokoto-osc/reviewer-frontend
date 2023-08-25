import { message } from 'ant-design-vue'
import type { FetchResponse, SearchParameters } from 'ofetch'
import type { Ref } from 'vue'
import type { UseFetchOptions } from '#app'
import { useUserStore } from '~/stores/useUserStore'
import IconEmoticonDead from '~icons/mdi/emoticon-dead'

export interface R<T> {
  code: number
  message: string
  data: T
  ts: number
}

type UrlType =
  | string
  | Request
  | Ref<string | Request>
  | (() => string | Request)

export type HttpOption<T> = UseFetchOptions<R<T>>

const handleError = <T>(
  response: FetchResponse<R<T>> & FetchResponse<ResponseType>
) => {
  const err = (text: string) => {
    message.error({
      content: response?._data?.message ?? text,
      icon: () => h(IconEmoticonDead)
    })
  }
  if (!response._data) {
    err('请求超时，服务器无响应！')
    return
  }
  const userStore = useUserStore()
  const handleMap: { [key: number]: () => void } = {
    404: () => err('服务器资源不存在'),
    500: () => err('服务器内部错误'),
    403: () => err('没有权限访问该资源'),
    401: () => {
      err('登录状态已过期，需要重新登录')
      userStore.clear()
      navigateTo('/auth/login')
    }
  }
  handleMap[response.status] ? handleMap[response.status]() : err('未知错误！')
}

// get方法传递数组形式参数
const paramsSerializer = (params?: SearchParameters) => {
  if (!params) return
  const query = structuredClone({ ...params })
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: unknown) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

const fetch = <T>(url: UrlType, option: UseFetchOptions<R<T>>) => {
  return useFetch<R<T>>(url, {
    // 请求拦截器
    onRequest({ options }) {
      // get方法传递数组形式参数
      options.params = paramsSerializer(options.params)
      // 设置 BaseURL
      const config = useRuntimeConfig()
      options.baseURL = config.public.endpoint.reviewerAPI || ''
      // 添加请求头,没登录不携带 token
      const userStore = useUserStore()
      if (userStore.isExpired) return
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${userStore.token}`)
    },
    // 响应拦截
    onResponse({ response }) {
      if (
        response.headers.get('content-disposition') &&
        response.status === 200
      )
        return response
      // 在这里判断错误
      if (response._data.code !== 0) {
        handleError<T>(response)
        return Promise.reject(response._data)
      }
      // 成功返回
      return response._data
    },
    // 错误处理
    onResponseError({ response }) {
      handleError<T>(response)
      return Promise.reject(response?._data ?? null)
    },
    // 合并参数
    ...option
  })
}

// 自动导出
export const useHTTP = {
  get: <T>(
    url: UrlType,
    params?: HttpOption<T>['params'],
    option?: HttpOption<T>
  ) => {
    return fetch<T>(url, { method: 'get', params, ...option })
  },

  post: <T>(
    url: UrlType,
    body?: HttpOption<T>['body'],
    option?: HttpOption<T>
  ) => {
    return fetch<T>(url, { method: 'post', body, ...option })
  },

  put: <T>(
    url: UrlType,
    body?: HttpOption<T>['body'],
    option?: HttpOption<T>
  ) => {
    return fetch<T>(url, { method: 'put', body, ...option })
  },

  delete: <T>(
    url: UrlType,
    body?: HttpOption<T>['body'],
    option?: HttpOption<T>
  ) => {
    return fetch<T>(url, { method: 'delete', body, ...option })
  }
}
