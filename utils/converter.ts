import { snakeCase, camelCase } from 'lodash-es'
import { PollMethod, PollStatus } from './../enums/poll'
import { HitokotoStatus, HitokotoType } from '@/enums/hitokoto'
const HitokotoTypeMap = {
  [HitokotoType.Anime]: '动画',
  [HitokotoType.Comic]: '漫画',
  [HitokotoType.Game]: '游戏',
  [HitokotoType.Novel]: '文学',
  [HitokotoType.Original]: '原创',
  [HitokotoType.Internet]: '来自网络',
  [HitokotoType.Other]: '其他',
  [HitokotoType.Movie]: '影视',
  [HitokotoType.Poem]: '诗词',
  [HitokotoType.NCM]: '网易云音乐',
  [HitokotoType.Philosophy]: '哲学',
  [HitokotoType.Joke]: '抖机灵（笑话，脑筋急转弯，段子等）'
} as Record<string, string>

export function convertHitokotoType(input: string | HitokotoType): string {
  return HitokotoTypeMap[input] || '未知分类'
}

const PollMethodMap = {
  [PollMethod.Approve]: '赞同',
  [PollMethod.Reject]: '驳回',
  [PollMethod.NeedModify]: '需要修改',
  [PollMethod.NeedCommonUserPoll]: '需要普通用户参与'
} as Record<number, string>

export function convertPollMethod(input: number): string {
  return PollMethodMap[input] || '未知'
}

const PollStatusMap = {
  [PollStatus.Unknown]: '未知（或从未创建）',
  [PollStatus.NotOpen]: '未开放',
  [PollStatus.Open]: '进行中',
  [PollStatus.Processing]: '处理中',
  [PollStatus.Suspended]: '暂停',
  [PollStatus.Closed]: '关闭',
  [PollStatus.OpenForCommonUser]: '普通用户投票',
  [PollStatus.Approved]: '通过',
  [PollStatus.Rejected]: '驳回',
  [PollStatus.NeedModify]: '需要修改'
} as Record<PollStatus, string>

export function convertPollStatus(input: PollStatus): string {
  return PollStatusMap[input] || '未知'
}

export function objToCamel<
  T extends { [key: string]: unknown },
  V extends { [key: string]: unknown } = { [key: string]: unknown }
>(obj: V): T {
  return (Object.keys(obj) as Array<keyof V>).reduce((acc, key) => {
    const camelKey = camelCase(key as unknown as string) as keyof T
    acc[camelKey] = obj[key] as unknown as T[keyof T]
    return acc
  }, {} as T)
}

export function objToSnake<
  T extends { [key: string]: unknown },
  V extends { [key: string]: unknown } = { [key: string]: unknown }
>(obj: V): T {
  return (Object.keys(obj) as Array<keyof V>).reduce((acc, key) => {
    const snakeKey = snakeCase(key as unknown as string) as keyof T
    acc[snakeKey] = obj[key] as unknown as T[keyof T]
    return acc
  }, {} as T)
}

const hitokotoStatusMap = {
  [HitokotoStatus.Pending]: '待审核',
  [HitokotoStatus.Approved]: '已通过',
  [HitokotoStatus.Rejected]: '已驳回'
}

export function convertHitokotoStatus(input: HitokotoStatus): string {
  return hitokotoStatusMap[input] || '未知'
}
