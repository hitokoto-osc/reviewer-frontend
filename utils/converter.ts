import { PollStatus } from './../enums/poll'
import { HitokotoType } from '@/enums/hitokoto'
const HitokotoTypeMap = {
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
  l: '抖机灵（笑话，脑筋急转弯，段子等）'
} as Record<string, string>

export function convertHitokotoType(input: string | HitokotoType): string {
  return HitokotoTypeMap[input] || '未知分类'
}

const PollMethodMap = {
  1: '赞同',
  2: '驳回',
  3: '需要修改',
  4: '需要普通用户参与'
} as Record<number, string>

export function convertPollMethod(input: number): string {
  return PollMethodMap[input] || '未知'
}

const PollStatusMap = {
  0: '未开放',
  1: '进行中',
  2: '处理中',
  100: '暂停',
  101: '关闭',
  102: '普通用户投票',
  200: '通过',
  201: '驳回',
  202: '需要修改'
} as Record<PollStatus, string>

export function convertPollStatus(input: PollStatus): string {
  return PollStatusMap[input] || '未知'
}
