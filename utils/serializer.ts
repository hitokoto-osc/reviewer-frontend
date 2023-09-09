import crypto from 'crypto-es'
import type { Serializer } from 'pinia-plugin-persistedstate'
export function getCookiesSerializer(): Serializer {
  return {
    serialize: (value) => {
      const runtimeConfig = useRuntimeConfig()
      const key = runtimeConfig.public.encrypt.cookiesKey
      const data = JSON.stringify(value)
      return crypto.AES.encrypt(data, key).toString(crypto.format.Hex)
    },
    deserialize: (value: string) => {
      const runtimeConfig = useRuntimeConfig()
      const key = runtimeConfig.public.encrypt.cookiesKey
      const data = crypto.AES.decrypt(
        crypto.enc.Hex.parse(value),
        key
      ).toString(crypto.enc.Utf8)
      return JSON.parse(data)
    }
  }
}
