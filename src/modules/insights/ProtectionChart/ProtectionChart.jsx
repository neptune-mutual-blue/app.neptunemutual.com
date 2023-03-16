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
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'
import { externalTooltipHandler } from '@/modules/insights/ProtectionChart/ChartTooltip'
import { getMaxDataValue, getSuggestedMaxValue, getTooltipFooter, getTooltipLabel, getTooltipTitle, getXTickValue } from '@/modules/insights/ProtectionChart/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

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
          categoryPercentage: 0.75
          // barThickness: 50
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
          borderWidth: 0
        },
        ticks: {
          callback: function (value) {
            return getXTickValue({
              value,
              dataKey,
              liquidityTokenDecimals,
              locale
            })
          },
          color: '#01052D',
          font: {
            size: 11,
            lineHeight: 1.125
          }
        },
        beginAtZero: true,
        suggestedMax: (function () {
          return getSuggestedMaxValue({
            data,
            dataKey
          })
        })()
      },
      y: {
        beginAtZero: true,
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
        chart.options.scales.y.ticks.font = {
          size: 10
        }
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
            return getTooltipTitle({
              data,
              dataKey,
              tooltipModel: this
            })
          },
          label: function () {
            return getTooltipLabel({
              data,
              dataKey,
              liquidityTokenDecimals,
              locale,
              tooltipModel: this
            })
          },
          footer: function () {
            return getTooltipFooter({
              data,
              dataKey,
              liquidityTokenDecimals,
              locale,
              tooltipModel: this
            })
          }
        }
      }
    }
  }

  const chartHeight = useMemo(() => {
    const _labels = chartData.labels
    const _datasets = chartData.datasets
    if (_datasets.length > 1 && _labels.length > 5) {
      const totalHeight = 32 + _labels.length * 60
      return `${totalHeight}px`
    }

    if (_datasets.length === 1 && _labels.length > 7) {
      const totalHeight = 32 + _labels.length * 50
      return `${totalHeight}px`
    }

    return '100%'
  }, [chartData])

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
          <div className='overflow-y-auto h-420 md:h-400 '>
            <div style={{ height: chartHeight }}>
              <Bar options={chartOptions} data={chartData} />
            </div>
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
