import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'
import HighchartsExporting from 'highcharts/modules/exporting'
import { useRouter } from 'next/router'

import { ShortNetworkNames } from '@/lib/connect-wallet/config/chains'
import DateLib from '@/lib/date/DateLib'
import ChainDropdown from '@/modules/governance/ChainDropdown'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { EMISSION_PER_EPOCH } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

const LiquidityGauge = ({ state, selectedChains, setSelectedChains, chainOption = [], data = [] }) => {
  const [hoveredName, setHoveredName] = useState(null)
  const [mouseEnteredOnLegend, setMouseEnteredOnLegend] = useState(false)
  const [mobile, setMobile] = useState(window.innerWidth < 768)

  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()

  const chartRef = useRef()

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

  useEffect(() => {
    if (data.length > 0) {
      setHoveredName(data[0]?.name)
    }
  }, [data])

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: mobile ? '311px' : '600px'
    },
    plotOptions: {
      pie: {
        slicedOffset: '0',
        borderWidth: '0',
        borderRadius: '0',
        innerSize: '60%',
        dataLabels: {
          distance: 20,
          format: '<b>{point.name}</b>: {point.y:.1f} %',
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
        y: item.percent,
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

  const chainDropdownOptions = chainOption.map((chainId) => ({
    label: ShortNetworkNames[chainId],
    value: chainId
  }))

  if (!data) return

  return (
    <GovernanceCard className='gap-6 p-4 md:p-8'>
      <ChainDropdown options={chainDropdownOptions} selected={selectedChains} onSelectionChange={setSelectedChains} state={state} />
      <div className='relative -my-5 gauge-chart-liquidity md:my-0'>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType='stockChart'
          ref={chartRef}
        />

        <div className='absolute top-[50%] left-[50%] max-w-[150px] md:max-w-[unset] translate-x-[-50%] translate-y-[-50%] text-center'>
          <div className='font-bold text-md md:text-display-sm'><Trans>Liquidity Gauge</Trans></div>
          <div className='text-sm font-medium md:text-md'>
            <Trans>Emission Per Epoch:{' '}</Trans>
            {formatCurrency(
              EMISSION_PER_EPOCH,
              router.locale,
              NPMTokenSymbol,
              true
            ).long}
          </div>
        </div>
      </div>

      <div className='mt-8 text-center'>
        <div className='mb-1 text-xl font-semibold'>{hoveredName} ({(data.find((item) => item.name === hoveredName)?.percent.toFixed(2))}%)</div>
        <div className='mb-4 text-md'>As of:{' '}
          {DateLib.toDateFormat(
            new Date(),
            router.locale,
            { month: 'short', day: '2-digit', year: 'numeric' },
            'UTC'
          )}
        </div>
      </div>

      <div className='max-w-[586px] mx-auto mb-4 md:mb-10 flex text-center justify-center'>
        {data.map((item, i) => (
          <div
            onMouseLeave={() => {
              setMouseEnteredOnLegend(false)
            }}
            onMouseEnter={() => {
              setMouseEnteredOnLegend(true)
              setHoveredName(item.name)
            }}
            key={item.name}
            style={{ borderRadius: i === 0 ? '16px 0 0 16px' : i === data.length - 1 ? '0 16px 16px 0 ' : undefined, width: item.percent + '%', height: '64px', background: item.color, opacity: mouseEnteredOnLegend && hoveredName !== item.name ? '0.2' : undefined, transition: 'all 0.3s' }}
          />
        ))}
      </div>
    </GovernanceCard>
  )
}

export default LiquidityGauge
