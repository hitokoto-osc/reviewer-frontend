export interface AuthLoginReq {
  email: string
  password: string
}

export interface AuthLoginRes {
  status: number
  message: string
  data: {
    token: string // 我们只需要其中的令牌部分，其他参数直接忽略
    is_suspended: number
  }[]
  ts: number
}

export function doLoginReq(req: AuthLoginReq) {
  return useFetch<AuthLoginRes>(
    '/api/auth/login', // 使用 Nuxt 代理的登录 API
    {
      method: 'POST',
      body: req
    }
  )
}
