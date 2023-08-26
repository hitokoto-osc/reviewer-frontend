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
