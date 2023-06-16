const SHADES_PER_COLOR = 6

export const colorArrays = [
  '#E31B54',
  '#A11043',
  '#F04438',
  '#B42318',
  '#FF692E',
  '#E62E05',
  '#FAC515',
  '#EAAA08',
  '#66C61C',
  '#4CA30D',
  '#15B79E',
  '#0E9384',
  '#2E90FA',
  '#175CD3',
  '#2970FF',
  '#0040C1',
  '#444CE7',
  '#2D31A6',
  '#BA24D5',
  '#821890',
  '#875BF7',
  '#5720B7',
  '#4E5BA6',
  '#293056'
]

export const getColorByIndex = (index, total) => {
  const colorIds = []
  for (let i = 0; i < total; i++) {
    colorIds.push((i % (colorArrays.length / SHADES_PER_COLOR)) * SHADES_PER_COLOR + (i % SHADES_PER_COLOR))
  }

  return colorIds.sort()[index]
}
