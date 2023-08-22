export function useCountTo(ref: Ref<number>, target: number, delay = 1) {
  const timer = setInterval(() => {
    const distance = Math.abs(ref.value - target)
    if (distance < 1) {
      clearInterval(timer)
      return
    }
    const len = distance.toString().length
    let step = 10 ** (len - 2)
    if (step < 1) {
      step = 1
    }
    if (ref.value < target) {
      ref.value += step
    } else if (ref.value > target) {
      ref.value -= step
    } else {
      clearInterval(timer)
    }
  }, delay)
  return timer
}
