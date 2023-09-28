export function trimEnd(inputString: string, charToRemove: string = ' ') {
  while (inputString.endsWith(charToRemove)) {
    inputString = inputString.slice(0, -charToRemove.length)
  }
  return inputString
}
