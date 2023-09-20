import { WebSearch } from '~/enums/app'

export function doWebSearch(type: WebSearch, s: string) {
  const search = encodeURIComponent(s)

  switch (type) {
    case WebSearch.Baidu:
      window.open(`https://www.baidu.com/s?wd=${search}`)
      break
    case WebSearch.Google:
      window.open(`https://www.google.com/search?q=${search}`)
      break
    case WebSearch.Bing:
      window.open(`https://www.bing.com/search?q=${search}`)
      break
    case WebSearch.DuckDuckGo:
      window.open(`https://duckduckgo.com/?q=${search}`)
      break
    default:
      throw new Error('Unknown search engine')
  }
}
