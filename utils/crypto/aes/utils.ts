import {
  arrayBufferToHex,
  uint8ArrayToHex,
  hexToUint8Array,
  hexToArrayBuffer
} from '../utils'

export interface Data {
  iv: Uint8Array
  data: ArrayBuffer
}

export function toHex(data: Data): string {
  return `${uint8ArrayToHex(data.iv)}-${arrayBufferToHex(data.data)}`
}

export function toData(hex: string): Data {
  const [iv, data] = hex.split('-')
  return {
    iv: hexToUint8Array(iv),
    data: hexToArrayBuffer(data)
  }
}

export const isDataHexString = (maybeHex: string) =>
  maybeHex.length > 0 && maybeHex.includes('-')
