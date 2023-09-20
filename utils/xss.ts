import { FilterXSS, getDefaultWhiteList } from 'xss'

const xss = new FilterXSS({
  whiteList: {
    ...getDefaultWhiteList(),
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'data-fancybox']
  }
})

export function filterXSS(html: string): string {
  return xss.process(html)
}
