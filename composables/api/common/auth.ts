export interface AuthLoginReq {
  email: string
  password: string
}

export interface AuthLoginRes {
  status: number
  message: string
  data: {
    token: string // 我们只需要其中的令牌部分，其他参数直接忽略
  }[]
  ts: number
}

export function useLoginReq(req: AuthLoginReq) {
  const config = useRuntimeConfig()
  const formData = new FormData()
  formData.append('account', req.email)
  formData.append('password', req.password)
  return useFetch<AuthLoginRes>('/api/auth/login', {
    lazy: true,
    method: 'POST',
    body: req,
    baseURL: config.endpoint.commonAPI
  })
}
