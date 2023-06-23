export const colorsArray = [
  '#A11043',
  '#E31B54',
  '#B42318',
  '#F04438',
  '#E62E05',
  '#FF692E',
  '#EAAA08',
  '#FAC515',
  '#4CA30D',
  '#66C61C',
  '#0E9384',
  '#15B79E',
  '#175CD3',
  '#2E90FA',
  '#0040C1',
  '#2970FF',
  '#2D31A6',
  '#444CE7',
  '#821890',
  '#BA24D5',
  '#5720B7',
  '#875BF7',
  '#293056',
  '#4E5BA6'
]

const getColorByIndex = (index, total) => {
  const cols = colorsArray.length / 2
  const numbersArray = Array(total).fill(0).map((_, i) => { return i })
  const diff = total - cols > 0 ? total - cols : 0

  const sameIndexItems = numbersArray.slice(0, diff * 2)
  const increasingIndexItems = numbersArray.slice(diff * 2).map((item, i) => { return (item + i + 1) })

  const finalArrayOfIndexes = [...sameIndexItems, ...increasingIndexItems].map(idx => { return (idx % colorsArray.length) })
  const colorAtIndex = colorsArray[finalArrayOfIndexes[index]]

  return colorAtIndex
}

export { getColorByIndex }
