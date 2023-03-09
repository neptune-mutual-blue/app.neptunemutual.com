import React, { useEffect, useRef } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'

import HighchartsExporting from 'highcharts/modules/exporting'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const HistoricalRoi = ({ loading, data }) => {
  const chartRef = useRef()

  useEffect(() => {
    console.log(data)
  }, [data])

  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

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
    series: [
      {
        type: 'areaspline',
        name: isMainNet ? 'Ethereum' : 'Fuji',
        data: (data ?? [])
          .filter((item) => item.chainId === '1' || item.chainId === '43113')
          .map((item) => ({
            x: new Date(item.startDate).valueOf(),
            y: parseFloat((parseFloat(item.apr) * 100).toFixed(2))
          }))
          .sort((a, b) => a.x - b.x),
        lineWidth: 3,
        lineColor: '#4E7DD9',
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
          lineColor: '#4E7DD9'
        },
        animation: {
          duration: 500
        }
      }
    ],
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
      pointFormat: '<div class=\'px-4 pr-6 py-3 bg-white bg-opacity-95 rounded-tooltip border border-B0C4DB shadow-hc-tooltip\'><p class=\'font-semibold font-poppins tracking-normal text-01052D text-h6\'><div class=\'text-xs\'>{series.name}</div><div class=\'text-h6 text-sm text-black\'>{point.y}%</div></p></div>',
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

  if (isMainNet) {
    chartOptions.series = [
      ...chartOptions.series,
      {
        type: 'areaspline',
        name: 'Arbitrum',
        data: (data ?? [])
          .filter((item) => item.chainId === '42161')
          .map((item) => ({
            x: new Date(item.startDate).valueOf(),
            y: parseFloat((parseFloat(item.apr) * 100).toFixed(2))
          }))
          .sort((a, b) => a.x - b.x),
        lineWidth: 3,
        lineColor: '#21AD8C',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgb(33, 173, 140, 0.2)'],
            [1, 'rgb(33, 173, 140, 0)']
          ]
        },
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          radius: 3,
          lineColor: '#4E7DD9'
        },
        animation: {
          duration: 500
        }
      }
    ]
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
        {!isMainNet
          ? (
            <>
              <div className='flex items-center gap-1'>
                <div className='rounded-full h-4 w-4 border-4 border-4e7dd9' />
                <span className='text-sm font-semibold'>Fuji</span>
              </div>
            </>
            )
          : (
            <>
              <div className='flex items-center gap-1'>
                <div className='rounded-full h-4 w-4 border-4 border-4e7dd9' />
                <span className='text-sm font-semibold'>Ethereum</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='rounded-full h-4 w-4 border-4 border-[#21AD8C]' />
                <span className='text-sm font-semibold'>Arbitrum</span>
              </div>
            </>
            )}
      </div>
    </div>
  )
}

export { HistoricalRoi }
