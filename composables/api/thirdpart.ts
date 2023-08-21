export interface BingImage {
  images: Image[]
  tooltips: Tooltips
}

export interface Image {
  startdate: string
  fullstartdate: string
  enddate: string
  url: string
  urlbase: string
  copyright: string
  copyrightlink: string
  title: string
  quiz: string
  wp: boolean
  hsh: string
  drk: number
  top: number
  bot: number
  hs: unknown[]
}

export interface Tooltips {
  loading: string
  previous: string
  next: string
  walle: string
  walls: string
}

// useBingImage 返回必应每日图片
export function useBingImage() {
  return useFetch<BingImage>('/api/bing-image', {
    lazy: true,
    server: false // 服务端渲染毫无意义
  })
}
