export function randomIntInRange(from: number, to: number) {
  const [min, max] = [from, to].sort()
  const range = max - min;

  return Math.round(min + range * Math.random())
}