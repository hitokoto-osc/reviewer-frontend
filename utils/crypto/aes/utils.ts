import { uint8ArrayToHex, hexToUint8Array } from '../utils'

export interface Data {
  iv: Uint8Array
  data: Uint8Array
}

export function toHex(data: Data): string {
  return `${uint8ArrayToHex(data.iv)}-${uint8ArrayToHex(data.data)}`
}

export function toData(hex: string): Data {
  const [iv, data] = hex.split('-')
  return {
    iv: hexToUint8Array(iv),
    data: hexToUint8Array(data)
  }
}

export const isDataHexString = (maybeHex: string) =>
  maybeHex.length > 0 && maybeHex.includes('-')
