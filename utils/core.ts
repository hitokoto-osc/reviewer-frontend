import moment from 'moment'

export function formatTime(input: string) {
  return moment(input).format('YYYY-MM-DD HH:mm')
}

export function formatPollType(input: number) {
  const output = []
  output[1] = '批准'
  output[2] = '驳回'
  output[3] = '需要更改'
  output[4] = '需要用户补充投票'
  return output[input] || '未知操作'
}

export function formatType(input: string) {
  const output: { [index: string]: string } = {
    a: '动画',
    b: '漫画',
    c: '游戏',
    d: '文学',
    e: '原创',
    f: '来自网络',
    g: '其他',
    h: '影视',
    i: '诗词',
    j: '网易云音乐',
    k: '哲学',
    l: '抖机灵（笑话，脑筋急转弯，段子等）',
  }

  return output[input] || '未知分类'
}
