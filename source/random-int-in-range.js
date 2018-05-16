export function randomIntInRange(from, to) {
  const [min, max] = [from, to].sort()
  const range = max - min;

  return Math.round(min + range * Math.random())
}