const colorsArray = [
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

function getCyclicElements (arr, step) {
  const total = arr.length
  const result = []

  for (let start = 0; start < step; start++) {
    for (let i = start; i < total; i += step) {
      result.push(arr[i])
    }
  }

  return result
}
const colors = getCyclicElements(colorsArray, 5)

const getColorByIndex = (index) => {
  const colorAtIndex = colors[(index + 1) % colors.length]

  return colorAtIndex
}

export { getColorByIndex }
