import { convertFromUnits, sort, sumOf, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'

const getTooltipItem = (data, tooltipModel) => {
  const datasetIndex = tooltipModel.dataPoints[0].datasetIndex
  const dataIndex = tooltipModel.dataPoints[0].dataIndex
  const _data = Object.values(data)
  const item = _data[datasetIndex][dataIndex]

  return item
}

const getMaxDataValue = (data, dataKey) => {
  if (!data || !dataKey) { return 0 }

  const itemSet = Object.keys(data).reduce((acc, curr) => {
    const arr = data[curr]
    arr.forEach(item => { return acc.add(item[dataKey]) })

    return acc
  }, new Set())

  return sort(Array.from(itemSet), undefined, true)[0]
}

const getXTickValue = ({ dataKey, value, liquidityTokenDecimals, locale }) => {
  if (dataKey === 'incomePercent') {
    return `${(Number(value) * 100).toFixed(0)}%`
  }

  const amount = convertFromUnits(value, liquidityTokenDecimals).toString()
  const formatted = formatCurrency(amount, locale, undefined, false, true).short

  return formatted === 'N/A' ? '$0' : formatted.replace(/\.0+/, '')
}

const getSuggestedMaxValue = ({ data, dataKey }) => {
  const max = getMaxDataValue(data, dataKey)

  if (dataKey === 'incomePercent') {
    return max < 1 ? Number(max) + 0.02 : Number(max) + 0.25
  }

  const offset = toBN(max).dividedToIntegerBy(25)

  return parseInt(sumOf(max, offset).toString())
}

const getTooltipTitle = ({ data, dataKey, tooltipModel }) => {
  const item = getTooltipItem(data, tooltipModel)

  if (['totalProtection', 'totalPremium'].includes(dataKey)) { return undefined }

  return `${item.expired
    ? '<p class="font-semibold text-xs leading-4.5 text-FA5C2F">Expired</p>'
    : '<p class="font-semibold text-xs leading-4.5 text-21AD8C">Active</p>'
  }`
}

const getTooltipLabel = ({ data, dataKey, liquidityTokenDecimals, locale, tooltipModel }) => {
  const item = getTooltipItem(data, tooltipModel)

  if (['totalProtection', 'totalPremium'].includes(dataKey)) {
    const name = item.productKeyString || item.coverKeyString
    const amount = convertFromUnits(item[dataKey], liquidityTokenDecimals).toString()
    const formatted = formatCurrency(amount, locale).long

    return `<div>
      <p class="text-xs text-404040 font-medium uppercase">${name}</p>
      <p class="text-sm leading-5 font-semibold">
      ${formatted}
      <p>
    </div>`
  }

  const dateString = item.label
    .replace('-', ' ')
    .toUpperCase()

  let label = `<p class="mt-1 text-xs leading-4.5 text-01052D">
  ${item.networkName} (${dateString})
  </p>`

  if (dataKey === 'incomePercent') {
    const amount = convertFromUnits(item.income, liquidityTokenDecimals).toString()
    const formatted = formatCurrency(amount, locale).long

    label += `<p class="text-sm leading-5 font-semibold">
    ${Math.round(item.incomePercent * 100)}% / ${formatted}
    <p>`
  }

  return label
}

const getTooltipFooter = ({ data, dataKey, tooltipModel, liquidityTokenDecimals, locale }) => {
  if (['totalProtection', 'totalPremium'].includes(dataKey)) { return undefined }

  const item = getTooltipItem(data, tooltipModel)
  const amount = convertFromUnits(item[dataKey], liquidityTokenDecimals).toString()
  const formatted = formatCurrency(amount, locale).long

  let footerHtml = ''

  if (dataKey === 'incomePercent') {
    const protection = convertFromUnits(item.protection, liquidityTokenDecimals).toString()
    const formattedProtection = formatCurrency(protection, locale).long

    footerHtml = `<div class="mt-2">
    <p class="font-normal text-xs leading-4.5 text-404040">Protection</p>
    <p class="text-xs leading-4.5 font-semibold text-01052D">
    ${formattedProtection}
    </p>
    </div>`
  } else {
    footerHtml = `<p class="mt-0.5 leading-5 text-01052D font-semibold">${formatted}</p>`
  }

  return footerHtml
}

export {
  getTooltipItem,
  getTooltipTitle,
  getTooltipLabel,
  getTooltipFooter,
  getMaxDataValue,
  getXTickValue,
  getSuggestedMaxValue
}
