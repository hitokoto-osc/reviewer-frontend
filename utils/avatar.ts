import md5 from 'md5'

export function getAvatarURL(email: string): string {
  const hash = md5(email.trim().toLowerCase())
  return getAvatarURLByHash(hash)
}

export function getAvatarURLByHash(hash: string): string {
  return `https://cravatar.cn/avatar/${hash}?d=mm&s=500`
}
