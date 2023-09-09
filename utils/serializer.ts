import cryptoJS from 'crypto-js'
import type { Serializer } from 'pinia-plugin-persistedstate'

const getKey = () => {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public.encrypt.cookiesKey
}

export function getCookiesSerializer(): Serializer {
  return {
    serialize: (value) => {
      const key = getKey()
      const data = JSON.stringify(value)
      return cryptoJS.AES.encrypt(data, key).toString()
    },
    deserialize: (value: string) => {
      const key = getKey()
      const data = cryptoJS.AES.decrypt(value, key).toString(cryptoJS.enc.Utf8)
      return JSON.parse(data)
    }
  }
}
