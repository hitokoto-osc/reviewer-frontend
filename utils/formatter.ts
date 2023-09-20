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

export function formatPollComment(comment: string): string {
  try {
    const parsed = JSON.parse(comment) as SnakeSentence & { review: string } // 实际上应该是 Partial<SnakeSentence>，但是这里为了方便，就不写了
    const keys = Object.keys(parsed) as Array<
      keyof (SnakeSentence & { review: string })
    >
    if (keys.length === 1 && keys[0] === 'review') {
      return parsed.review
    }
    const tpl = keys.reduce((acc, cur, index) => {
      if (cur === 'review') {
        return acc
      }
      if (index !== 0) {
        acc += '，'
      }
      const target =
        cur === 'type' ? convertHitokotoType(parsed[cur]) : parsed[cur]
      return (
        acc +
        ` <b>${SentenceFieldMap[cur]}</b> 修改为 “<u>${target || '未填写'}</u>”`
      )
    }, '建议将')
    return `${tpl}。${parsed.review ? `  \n 此外，  \n${parsed.review}` : ''}`
  } catch (e) {
    return comment
  }
}
