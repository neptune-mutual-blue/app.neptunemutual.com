import React, { useRef, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'

import HighchartsExporting from 'highcharts/modules/exporting'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const colors = {
  'popular-defi-apps': '#4E7DD9',
  prime: '#7800D6',
  okx: '#21AD8C',
  binance: '#B48B34'
}

const getColorForCover = (cover) => {
  const color = colors[cover]

  return color ?? '#454545'
}

const HistoricalRoiByCover = ({ loading, data }) => {
  const chartRef = useRef()

  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  // const chains = isMainNet
  //   ? {
  //       1: 'Ethereum',
  //       42161: 'Arbitrum'
  //     }
  //   : {
  //       43113: 'Fuji'
  //     }

  // eslint-disable-next-line
  const [selectedChain, _] = useState(isMainNet ? '1' : '43113')

  const groupCovers = {}

  if (data) {
    data.forEach((item) => {
      if (item.chainId === selectedChain) {
        groupCovers[item.coverKeyString] = groupCovers[
          item.coverKeyString
        ]
          ? [...groupCovers[item.coverKeyString], item]
          : [item]
      }
    })
  }

  console.log(groupCovers)

  const chartOptions = {
    xAxis: {
      labels: {
        format:
          "<span class='font-poppins text-black uppercase'>{value:%b %y}</span>",
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
          return `<span class='font-poppins text-black'>${this.value}%</span>`
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
        lineWidth: 1, // Reduce the line width to make it more pointy
        step: true, // Set step to true to draw the line as a step line
        linecap: 'square'
      }
    },
    series: Object.entries(groupCovers).map(([key, value]) => {
      return {
        type: 'areaspline',
        name: key,
        data: value
          .map((item) => ({
            x: new Date(item.startDate).valueOf(),
            y: parseFloat((parseFloat(item.apr) * 100).toFixed(2))
          }))
          .sort((a, b) => a.x - b.x),
        lineWidth: 3,
        lineColor: getColorForCover(key),
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(78, 125, 217, 0.2)'],
            [1, 'rgba(78, 125, 217, 0)']
          ]
        },
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          radius: 3,
          lineColor: getColorForCover(key)
        },
        animation: {
          duration: 500
        }
      }
    }),
    chart: {
      backgroundColor: 'transparent',
      height: '424px'
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
      // pointFormat: ``,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderWidth: 0,
      shadow: false,
      shape: 'rect',
      pointFormat:
        "<div class='px-4 pr-6 py-3 bg-white bg-opacity-95 rounded-tooltip border border-B0C4DB shadow-hc-tooltip'><p class='font-semibold font-poppins tracking-normal text-01052D text-h6'><div class='text-xs'>{series.name}</div><div class='text-h6 text-sm text-black'>{point.y}%</div></p></div>",
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
        // tickInterval: 5 * 24 * 3600 * 1000,
        labels: {
          format:
            "<span class='font-poppins text-black uppercase'>{value:%b %y}</span>",
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

  // useEffect(() => {
  //   if (chartRef.current && chartRef?.current?.chart) {
  //     chartRef.current?.chart?.showLoading()
  //   }
  // }, [])

  return (
    <div data-testid='total-liquidity-chart' className='h-full pt-1'>
      {!loading && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType='stockChart'
          ref={chartRef}
        />
      )}

      <div className='flex justify-center items-center gap-4 mt-3'>
        {Object.entries(groupCovers).map(([key]) => (
          <div className='flex items-center gap-1' key={key}>
            <div
              className={`rounded-full h-4 w-4 border-4 border-[${getColorForCover(
                key
              )}]`}
            />
            <span className='text-sm font-semibold'>{key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { HistoricalRoiByCover }
