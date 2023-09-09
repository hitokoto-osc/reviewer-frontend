import dayjs from 'dayjs'

export function formatDateTime(input: string | number): string {
  return dayjs(input).format('YYYY-MM-DD HH:mm:ss')
}

const reviewerMap = {
  0: '未知',
  4756: '众裁委员会',
  4711: '众裁委员会',
  1: 'freejishu',
  6: '酷儿',
  7: '皮皮',
  1044: 'a632079',
  1699: '小白',
  2171: 'Kagari',
  5198: '狐狸',
  6844: 'Yuina',
  8221: 'KUCIKISan'
}

export function formatReviewer(reviewerUid: number): string | null | undefined {
  return reviewerMap.hasOwnProperty(reviewerUid)
    ? reviewerMap[reviewerUid as keyof typeof reviewerMap]
    : null
}

export type SnakeSentence = Omit<
  PollListCollectionElement['sentence'],
  | 'id'
  | 'creator_uid'
  | 'creator'
  | 'reviewer'
  | 'status'
  | 'poll_status'
  | 'created_at'
>

const SentenceFieldMap: Record<keyof SnakeSentence, string> = {
  uuid: '标识',
  hitokoto: '句子',
  type: '类型',
  from: '来源',
  from_who: '作者'
}

export function formartPollComment(comment: string): string {
  try {
    const parsed = JSON.parse(comment) as SnakeSentence
    return (
      '建议将' +
      (Object.keys(parsed) as Array<keyof SnakeSentence>)
        .map((key) => {
          const target =
            key === 'type' ? convertHitokotoType(parsed[key]) : parsed[key]
          return ` <b>${SentenceFieldMap[key]}</b> 修改为 “<u>${target}</u>”`
        })
        .join('，') +
      '。'
    )
  } catch (e) {
    return comment
  }
}
