// Credit: Nick Bull (https://stackoverflow.com/a/68121710)
export const explainInterval = (interval) => {
  if (!interval) {
    return ''
  }

  const scalars = [1000, 60, 60, 24, 7, 52]
  const units = ['ms', 'secs', 'mins', 'hrs', 'days', 'weeks', 'years']

  let index = 0
  let scaled = interval * 1000

  while (scaled > scalars[index]) {
    scaled /= scalars[index++]
  }

  const precision = scaled % 1 !== 0 ? 2 : 0

  return `${scaled.toFixed(precision)} ${units[index]}`
}
