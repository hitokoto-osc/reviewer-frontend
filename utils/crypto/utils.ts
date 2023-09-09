export function arrayBufferToHex(ab: ArrayBuffer): string {
  return uint8ArrayToHex(new Uint8Array(ab))
}

export function hexToArrayBuffer(hex: string): ArrayBuffer {
  return hexToUint8Array(hex).buffer
}

export function uint8ArrayToHex(u8a: Uint8Array): string {
  return u8a.reduce((a, b) => a + b.toString(16).padStart(2, '0'), '')
}

export function hexToUint8Array(hex: string): Uint8Array {
  return Uint8Array.from(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  )
}

export const isHex = (maybeHex: string) =>
  maybeHex.length !== 0 &&
  maybeHex.length % 2 === 0 &&
  !/[^a-fA-F0-9]/u.test(maybeHex)
