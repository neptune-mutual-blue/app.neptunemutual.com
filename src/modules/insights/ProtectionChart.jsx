import React, { useMemo } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import { convertFromUnits, sort, sumOf } from '@/utils/bn'
import { useAppConstants } from '@/src/context/AppConstants'
import { externalTooltipHandler } from '@/modules/insights/ChartTooltip'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const getTooltipItem = (data, tooltipModel) => {
  const datasetIndex = tooltipModel.dataPoints[0].datasetIndex
  const dataIndex = tooltipModel.dataPoints[0].dataIndex
  const _data = Object.values(data)
  const item = _data[datasetIndex][dataIndex]

  return item
}

const getMaxDataValue = (data, dataKey) => {
  if (!data || !dataKey) return 0

  const itemSet = Object.keys(data).reduce((acc, curr) => {
    const arr = data[curr]
    arr.forEach(item => acc.add(item[dataKey]))
    return acc
  }, new Set())

  return sort(Array.from(itemSet), undefined, true)[0]
}

const ProtectionChart = ({ loading, data, labels, dataKey = 'protection' }) => {
  const { locale } = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  /**
   * @type {import("chart.js").ChartData<'bar'>}
   */
  const chartData = useMemo(() => {
    if (!data || !labels.length) {
      return {
        labels: [],
        datasets: []
      }
    }

    return {
      labels,
      datasets: Object.keys(data).map(chain => {
        return {
          label: data[chain].length ? data[chain][0].networkName : '',
          data: data[chain].map(item => parseFloat(item[dataKey])),
          backgroundColor: ['1', '43113'].includes(chain) ? '#4E7DD9' : '#21AD8C',
          barPercentage: 1,
          borderWidth: 0,
          maxBarThickness: 17,
          categoryPercentage: 1
          // barThickness: 17
        }
      })
    }
  }, [data, labels, dataKey])

  /**
   * @type {import("chart.js").ChartOptions<'bar'>}
   */
  const chartOptions = {
    scales: {
      x: {
        position: 'top',
        grid: {
          display: true,
          borderDash: [2, 5],
          borderWidth: 0,
          drawTicks: false
        },
        ticks: {
          callback: function (value) {
            if (dataKey === 'incomePercent') {
              return `${Number(value) * 100}%`
            }

            const amount = convertFromUnits(value, liquidityTokenDecimals).toString()
            const formatted = formatCurrency(amount, locale, undefined, false, true).short
            return formatted === 'N/A' ? '$0' : formatted.replace(/\.\d+/, '')
          },
          color: '#01052D',
          font: {
            size: 11,
            lineHeight: 1.125
          }
        },
        suggestedMax: (function () {
          if (dataKey === 'incomePercent') return 1

          const max = getMaxDataValue(data, dataKey)
          return parseInt(sumOf(max, '10000000000').toString())
        })()
      },
      y: {
        grid: {
          display: false,
          borderColor: '#999BAB',
          borderWidth: 1
        },
        ticks: {
          callback: function (value) {
            return labels[value].toUpperCase()
          },
          color: '#01052D',
          font: {
            size: 11,
            lineHeight: 1.125
          }
        }
      }
    },
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    onResize: function (chart, size) {
      if (size.width < 768 && dataKey !== 'incomePercent') {
        const max = parseInt(getMaxDataValue(data, dataKey))
        // @ts-ignore
        chart.options.scales.x.suggestedMax = max
        chart.update()
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
        text: 'Chart.js Horizontal Bar Chart'
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
        displayColors: false,
        callbacks: {
          title: function () {
            const item = getTooltipItem(data, this)

            return `${item.expired
              ? '<p class="font-semibold text-xs leading-4.5 text-FA5C2F">Expired</p>'
              : '<p class="font-semibold text-xs leading-4.5 text-21AD8C">Active</p>'
            }`
          },
          label: function () {
            const item = getTooltipItem(data, this)

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
          },
          footer: function () {
            const item = getTooltipItem(data, this)
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
        }
      }
    }
  }

  return (
    <div className='grid grid-rows-[1fr_auto] gap-8 h-full'>
      {
      loading
        ? (
          <div className='flex items-center justify-center h-full overflow-y-auto'>
            Loading...
          </div>
          )
        : (
          <div className='h-full overflow-y-auto'>
            <Bar className='max-h-full h-391' options={chartOptions} data={chartData} />
          </div>
          )
      }
      <div className='flex items-center justify-center gap-4'>
        {!isMainNet
          ? (
            <>
              <div className='flex items-center gap-1'>
                <div className='w-3.5 h-3.5 rounded-full bg-4e7dd9' />
                <span className='text-sm font-semibold'>Fuji</span>
              </div>
            </>
            )
          : (
            <>
              <div className='flex items-center gap-1'>
                <div className='w-3.5 h-3.5 rounded-full bg-4e7dd9' />
                <span className='text-sm font-semibold'>Ethereum</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-3.5 h-3.5 rounded-full bg-21AD8C' />
                <span className='text-sm font-semibold'>Arbitrum</span>
              </div>
            </>
            )}
      </div>
    </div>
  )
}

export { ProtectionChart }
