import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { HighchartsReactComponent } from '@/common/HighChartsReactComponent'
import { ShortNetworkNames } from '@/lib/connect-wallet/config/chains'
import DateLib from '@/lib/date/DateLib'
import ChainDropdown from '@/modules/governance/ChainDropdown'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { getAsOfDate } from '@/utils/snapshot'

const LiquidityGauge = ({ start, end, state, selectedChains, setSelectedChains, chainIds = [], results = [], emission }) => {
  const [hoveredName, setHoveredName] = useState(null)
  const [mouseEnteredOnLegend, setMouseEnteredOnLegend] = useState(false)
  const [mobile, setMobile] = useState(window.innerWidth < 768)

  const chartRef = useRef()
  const router = useRouter()
  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()

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

  const { allZeros, data } = useMemo(() => {
    if (results.length > 0) {
      setHoveredName(results[0]?.name)
    }

    const allZeros = !results.find(s => { return toBNSafe(s.percent).isGreaterThan(0) })
    const equalDistribution = 100 / results.length

    return {
      data: results.map(s => {
        return {
          ...s,
          percent: Number(s.percent) * 100,
          y: allZeros ? equalDistribution : Number(s.percent) * 100
        }
      }),
      allZeros
    }
  }, [results])

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
          format: allZeros ? '<b>{point.name}</b>: 0%' : '<b>{point.name}</b>: {point.y:.1f} %',
          connectorColor: 'black'
        },
        showInLegend: false,
        allowPointSelect: true
      }
    },
    series: [{
      name: 'pie',
      colorByPoint: true,
      data,
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

  const chainDropdownOptions = chainIds.map((chainId) => {
    return {
      label: ShortNetworkNames[chainId] || '',
      value: chainId
    }
  })
  const asOfDate = getAsOfDate(start, end)

  const formattedEmission = formatCurrency(convertFromUnits(emission, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedDate = DateLib.toLongDateFormat(
    asOfDate,
    router.locale,
    'UTC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZoneName: 'short'
    })

  if (!results) { return }

  return (
    <GovernanceCard className='gap-6 p-4 md:p-8'>
      <ChainDropdown options={chainDropdownOptions} selected={selectedChains} onSelectionChange={setSelectedChains} state={state} />
      <div className='relative -my-5 gauge-chart-liquidity md:my-0'>
        <HighchartsReactComponent
          options={chartOptions}
          constructorType='stockChart'
          ref={chartRef}
        />

        <div className='absolute top-[50%] left-[50%] max-w-[150px] md:max-w-[unset] translate-x-[-50%] translate-y-[-50%] text-center'>
          <div className='font-bold text-md md:text-display-sm'>Liquidity Gauge</div>
          <div className='text-sm font-medium md:text-md'>
            Epoch Emission:{' '}
            {formattedEmission.long}
          </div>
        </div>
      </div>

      <div className='mt-8 text-center'>
        <div className='mb-1 text-xl font-semibold'>
          {hoveredName} ({formatPercent(results.find((item) => { return item.name === hoveredName })?.percent)})
        </div>
        <div className='mb-4 text-md' title={DateLib.toLongDateFormat(asOfDate, router.locale)}>
          As of:{' '}{formattedDate}
        </div>
      </div>

      <div className='max-w-[586px] mx-auto mb-4 md:mb-10 flex text-center justify-center'>
        {results.map((item, i) => {
          return (
            <div
              onMouseLeave={() => {
                setMouseEnteredOnLegend(false)
              }}
              onMouseEnter={() => {
                setMouseEnteredOnLegend(true)
                setHoveredName(item.name)
              }}
              key={item.name}
              style={{
                borderRadius: i === 0 ? '16px 0 0 16px' : i === results.length - 1 ? '0 16px 16px 0 ' : undefined,
                width: (item.percent * 100) + '%',
                height: '64px',
                background: item.color,
                opacity: mouseEnteredOnLegend && hoveredName !== item.name
                  ? '0.2'
                  : undefined,
                transition: 'all 0.3s'
              }}
            />
          )
        })}
      </div>
    </GovernanceCard>
  )
}

export default LiquidityGauge
