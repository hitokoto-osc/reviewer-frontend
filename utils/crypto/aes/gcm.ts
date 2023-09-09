import type { Data } from './utils'

export function importKey(keyStr: string) {
  const key = JSON.parse(keyStr)
  return crypto.subtle.importKey('jwk', key, 'AES-GCM', true, [
    'encrypt',
    'decrypt'
  ])
}

export async function encrypt(
  key: CryptoKey,
  data: ArrayBuffer
): Promise<Data> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const result = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  return { iv, data: result }
}

export async function decrypt(
  key: CryptoKey,
  data: Data
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: data.iv }, key, data.data)
}
