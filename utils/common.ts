import dayjs from 'dayjs'
export function greetingByTime(time: dayjs.Dayjs) {
  const hour = time.hour()
  if (hour >= 5 && hour < 9) {
    return '早上好'
  } else if (hour >= 9 && hour < 11) {
    return '上午好'
  } else if (hour >= 11 && hour < 13) {
    return '中午好'
  } else if (hour >= 13 && hour < 18) {
    return '下午好'
  } else if (hour >= 18 && hour < 23) {
    return '晚上好'
  } else if (hour >= 23 || hour < 5) {
    return '夜深了'
  }
}
