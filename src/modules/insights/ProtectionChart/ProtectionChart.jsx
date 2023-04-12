import { useMemo } from 'react'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { useRouter } from 'next/router'
import { Bar } from 'react-chartjs-2'

import {
  ChainAnalyticsColors,
  ShortNetworkNames
} from '@/lib/connect-wallet/config/chains'
import {
  externalTooltipHandler
} from '@/modules/insights/ProtectionChart/ChartTooltip'
import {
  getMaxDataValue,
  getSuggestedMaxValue,
  getTooltipFooter,
  getTooltipLabel,
  getTooltipTitle,
  getXTickValue
} from '@/modules/insights/ProtectionChart/utils'
import { useAppConstants } from '@/src/context/AppConstants'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

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

  const ChainIds = data ? Object.keys(data) : []

  const chains = ChainIds.map(chainId => ({
    label: ShortNetworkNames[chainId],
    value: chainId

  }))

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
          backgroundColor: ['1', '84531'].includes(chain) ? '#4E7DD9' : '#21AD8C',
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
        external: (context, className) => externalTooltipHandler(context, className, dataKey),
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
    <div className={classNames(
      'grid grid-rows-[1fr_auto] h-full',
      ['totalProtection', 'totalPremium'].includes(dataKey) ? 'gap-0' : 'gap-8'
    )}
    >
      {
      loading
        ? (
          <div className='flex items-center justify-center h-full overflow-y-auto'>
            <Trans>loading...</Trans>
          </div>
          )
        : (
          <div
            className={classNames(
              'overflow-y-auto lg:h-392',
              ['totalProtection', 'totalPremium'].includes(dataKey) ? 'md:h-450' : 'md:h-400'
            )}
          >
            <div style={{ height: chartHeight }}>
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
          )
      }

      {
        !['totalProtection', 'totalPremium'].includes(dataKey) && (
          <div className='flex items-center justify-center gap-4'>
            {chains.map(chain => (
              <div className='flex items-center gap-1' key={chain.value}>
                <div className={'rounded-full h-3.5 w-3.5 bg-' + ChainAnalyticsColors[chain.value]} />
                <span className='text-sm font-semibold'>{chain.label}</span>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

export { ProtectionChart }
