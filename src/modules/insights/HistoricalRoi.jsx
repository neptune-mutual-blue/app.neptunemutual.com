import { useRef } from 'react'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'
import HighchartsExporting from 'highcharts/modules/exporting'

import { ChainAnalyticsColors, ShortNetworkNames } from '@/lib/connect-wallet/config/chains'
import { hexToRgba } from '@/utils/hex-to-rgba'
import { Trans } from '@lingui/macro'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const HistoricalRoi = ({ loading, data }) => {
  const chartRef = useRef()

  const ChainIds = data ? Array.from(new Set(data.map(entry => entry.chainId))) : []

  const chains = ChainIds.map(chainId => ({
    label: ShortNetworkNames[chainId],
    value: chainId

  }))

  const chartOptions = {
    xAxis: {
      labels: {
        format:
          "<span class='text-black uppercase'>{value:%b %y}</span>",
        useHTML: true
      },
      ordinal: false,
      minRange: 1 * 24 * 3600 * 1000,
      lineWidth: 0,
      lineColor: '#01052D'
    },
    yAxis: {
      opposite: false,
      labels: {
        formatter: function () {
          return `<span class='text-black'>${this.value}%</span>`
        },
        useHTML: true
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#01052D40',
      gridLineWidth: 0.5,
      min: 0,
      lineWidth: 0,
      lineColor: '#01052D',
      showLastLabel: true
    },
    plotOptions: {
      areaspline: {
        lineWidth: 1,
        step: true,
        linecap: 'square'
      }
    },
    series: chains.map(chain => (
      {
        type: 'areaspline',
        showInNavigator: true,
        name: chain.label,
        data: (data ?? [])
          .filter((item) => item.chainId === chain.value)
          .map((item) => ({
            x: new Date(item.startDate).valueOf(),
            y: parseFloat((parseFloat(item.apr) * 100).toFixed(2))
          }))
          .sort((a, b) => a.x - b.x),
        lineWidth: 3,
        lineColor: '#' + ChainAnalyticsColors[chain.value],
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, hexToRgba(ChainAnalyticsColors[chain.value], 0.2)],
            [1, hexToRgba(ChainAnalyticsColors[chain.value], 0)]
          ]
        },
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          radius: 3,
          lineColor: '#' + ChainAnalyticsColors[chain.value]
        },
        animation: {
          duration: 500
        }
      }
    )),
    chart: {
      backgroundColor: 'transparent',
      height: '408px'
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      animation: true,
      xDateFormat: false,
      useHTML: true,
      padding: 0,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderWidth: 0,
      shadow: false,
      shape: 'rect',
      pointFormat: '<div class=\'px-4 pr-6 py-3 bg-white bg-opacity-95 rounded-tooltip border border-B0C4DB shadow-hc-tooltip\'><p class=\'font-semibold tracking-normal text-01052D text-md tracking-wider\'><div class=\'text-xs\'>{series.name}</div><div class=\'text-md tracking-wider text-sm text-black\'>{point.y}%</div></p></div>',
      headerFormat: '',
      hideDelay: 100,
      outside: false
    },
    navigator: {
      handles: {
        symbols: [
          'url(/icons/chart-navigator-handle.svg)',
          'url(/icons/chart-navigator-handle.svg)'
        ],
        lineWidth: 1,
        width: 20,
        height: 30
      },
      maskFill: 'rgba(66, 137, 242, 0.3)',
      outlineWidth: 0,
      xAxis: {
        labels: {
          format:
            "<span class='text-black uppercase'>{value:%b %y}</span>",
          useHTML: true,
          style: {
            color: '#01052D'
          },
          align: 'right',
          y: 14
        }
      }
    },
    scrollbar: {
      enabled: false
    }
  }

  return (
    <div data-testid='total-liquidity-chart' className='h-full pt-1'>
      {loading && (
        <div className='flex items-center justify-center h-full overflow-y-auto'>
          <Trans>loading...</Trans>
        </div>
      )}
      {!loading && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType='stockChart'
          ref={chartRef}
        />
      )}

      <div className='flex items-center justify-center gap-4 mt-3'>

        {chains.map(chain => (
          <div className='flex items-center gap-1' key={chain.value}>
            <div className={'rounded-full h-3.5 w-3.5 bg-' + ChainAnalyticsColors[chain.value]} />
            <span className='text-sm font-semibold'>{chain.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { HistoricalRoi }
