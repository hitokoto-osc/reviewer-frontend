import md5 from 'md5'

export function getAvatarURL(email: string): string {
  const hash = md5(email.trim().toLowerCase())
  return `https://cravatar.cn/avatar/${hash}?d=mm&s=500`
}
