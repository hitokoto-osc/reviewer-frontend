import type { AuthLoginReq, AuthLoginRes } from '../../../composables/api'
import queryString from 'query-string'
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AuthLoginReq>(event)
    console.log(body)
    const config = useRuntimeConfig()
    const baseURL = config.public.endpoint.commonAPI
    const data = await $fetch<AuthLoginRes>('/auth/login', {
      method: 'POST',
      body: queryString.stringify(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      baseURL,
      parseResponse: JSON.parse
    })
    return data
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal Server Error',
      data: [],
      ts: Date.now()
    }
  }
})
