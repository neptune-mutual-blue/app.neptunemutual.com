import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'
import HighchartsExporting from 'highcharts/modules/exporting'
import Link from 'next/link'

import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import ChainDropdown from '@/modules/pools/liquidity-gauge-pools/ChainDropdown'
import { t } from '@lingui/macro'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const crumbs = [
  { name: t`Liquidity Gauge Pools`, href: '/pools/liquidity-gauge-pools', current: false },
  {
    name: t`Latest Gauge`,
    href: '',
    current: true
  }
]

const DROPDOWN_OPTIONS = [
  {
    label: 'Ethereum',
    value: 1
  },
  {
    label: 'Arbitrum',
    value: 42161
  },
  {
    label: 'Base Goerli',
    value: 84531
  }
]

const LatestGauge = () => {
  const chartRef = useRef()

  const data = [
    {
      name: 'xdai-f-x3CRV-guage',
      percentage: 35,
      date: 'Sep 23, 2025',
      color: '#E31B54'
    },
    {
      name: 'prime/arb',
      percentage: 5,
      date: 'Sep 23, 2025',
      color: '#BA24D5'

    },
    {
      name: 'binance/arb',
      percentage: 10,
      date: 'Sep 23, 2025',
      color: '#6938EF'

    },
    {
      name: '2pool-frax',
      percentage: 10,
      date: 'Sep 23, 2025',
      color: '#099250'

    },
    {
      name: 'crveth',
      percentage: 30,
      date: 'Sep 23, 2025',
      color: '#293056'

    },
    {
      name: 'f-cvxeth',
      percentage: 7.5,
      date: 'Sep 23, 2025',
      color: '#CA8504'

    },
    {
      name: 'f-stgusdc',
      percentage: 2.5,
      date: 'Sep 23, 2025',
      color: '#FF692E'

    }
  ]

  const [chartColors, setChartColors] = useState(null)
  const [hoveredName, setHoveredName] = useState(data[0].name)
  const [mouseEnteredOnLegend, setMouseEnteredOnLegend] = useState(false)

  const setChartData = () => {
    if (!chartColors) {
      setChartColors(chartRef.current?.chart.series[0].points.reduce((acc, point) => ({ ...acc, [point.name]: point.color }), {}))
    }
  }

  const [mobile, setMobile] = useState(window.innerWidth < 768)

  // choose the screen size
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setMobile(true)
    } else {
      setMobile(false)
    }
  }, [])

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: mobile ? '311px' : '600px',
      events: {
        render: () => {
          setChartData()
        }
      }
    },
    plotOptions: {
      pie: {
        slicedOffset: '0',
        borderWidth: '0',
        borderRadius: '0',
        innerSize: '60%',
        dataLabels: {
          distance: 20,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          connectorColor: 'black'
        },
        showInLegend: false,
        allowPointSelect: true
      }
    },
    series: [{
      name: 'pie',
      colorByPoint: true,
      data: data.map(item => ({
        name: item.name,
        y: item.percentage,
        color: item.color
      })),
      dataLabels: {
        enabled: !mobile,
        connectorWidth: mobile ? 0 : 1,
        distance: mobile ? 0 : 30,

        style: {
          fontWeight: 'bold',
          textOutline: 'none'
        },
        formatter: function () {
          return this.y > 2.5 ? this.point.name : null
        }
      }
    }],
    tooltip: {
      formatter: function () {
        if (this.key) {
          setHoveredName(this.key)
        }
        return []
      }
    },
    scrollbar: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
    xAxis: {
      lineWidth: 0
    },
    credits: { enabled: false },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    rangeSelector: { enabled: false, inputEnabled: false }
  }

  const [selectedChains, setSelectedChains] = useState([])

  return (
    <Container className='pt-8 md:pt-16 pb-36' data-testid='pod-staking-page-container'>
      <div>
        <BreadCrumbs
          className='mb-8 md:mb-11'
          pages={crumbs}
        />

        <div className='bg-white border-1 border-B0C4DB rounded-2xl p-4 md:p-8'>
          <div>
            <ChainDropdown options={DROPDOWN_OPTIONS} selected={selectedChains} onSelectionChange={setSelectedChains} />
          </div>
          <div className='gauge-chart-liquidity -my-5 md:my-0 relative'>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              constructorType='stockChart'
              ref={chartRef}
            />

            <div className='absolute top-[50%] left-[50%] max-w-[150px] md:max-w-[unset] translate-x-[-50%] translate-y-[-50%] text-center'>
              <div className='text-md md:text-display-sm font-bold'>Liquidity Gauge</div>
              <div className='text-sm md:text-md font-medium'>Block Emission: 300,000 NPM</div>
            </div>
          </div>

          <div className='text-center mt-8'>
            <div className='text-xl font-semibold mb-1'>{hoveredName} ({(data.find((item) => item.name === hoveredName).percentage)}%)</div>
            <div className='text-md mb-4'>As of: Sep 23, 2025</div>
          </div>

          <div className='max-w-[586px] mx-auto mb-4 md:mb-10 flex'>
            {data.map((item, i) => (
              <div
                onMouseLeave={() => {
                  setMouseEnteredOnLegend(false)
                }}
                onMouseEnter={() => {
                  setMouseEnteredOnLegend(true)
                  setHoveredName(item.name)
                }} key={item.name} style={{ borderRadius: i === 0 ? '16px 0 0 16px' : i === data.length - 1 ? '0 16px 16px 0 ' : undefined, width: item.percentage + '%', height: '64px', background: (chartColors ?? {})[item.name], opacity: mouseEnteredOnLegend && hoveredName !== item.name ? '0.2' : undefined, transition: 'all 0.3s' }}
              />
            ))}
          </div>

          <Link className='' href='#'>
            <div className='flex items-center justify-center mb-1 gap-1 md:hidden text-4E7DD9 text-sm cursor-pointer font-semibold'>
              Submit Your Vote <ExternalLinkIcon />
            </div>
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default LatestGauge
