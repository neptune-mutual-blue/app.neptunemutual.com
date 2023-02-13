import { BarChart } from '@/modules/analytics/BarChart'
import { useEffect, useState, useMemo } from 'react'
import ChevronLeftLgIcon from '@/icons/ChevronLeftLgIcon'
import ChevronRightLgIcon from '@/icons/ChevronRightLgIcon'
import { getMonthsBetweenDates } from '@/lib/dates'
import { useAppConstants } from '@/src/context/AppConstants'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { convertFromUnits } from '@/utils/bn'

const getInitialDateRange = (from) => {
  const currentDate = from

  const eightMonthsBack = new Date(currentDate)
  eightMonthsBack.setMonth(eightMonthsBack.getMonth() - 7)
  eightMonthsBack.setDate(1)
  eightMonthsBack.setHours(0, 0, 0, 0)

  currentDate.setDate(1)
  currentDate.setHours(0, 0, 0, 0)

  return [new Date(eightMonthsBack), new Date(currentDate.getTime())]
}

function CoverEarning () {
  const [dateRange, setDateRange] = useState(getInitialDateRange(new Date()))

  const { data } = useProtocolDayData()

  const { liquidityTokenDecimals } = useAppConstants()

  const [currentData, setCurrentData] = useState([])

  const [labels, setLabels] = useState(getMonthsBetweenDates(dateRange[0], dateRange[1]))

  const onPrevious = () => {
    const newInitialDate = dateRange[0]
    newInitialDate.setMonth(newInitialDate.getUTCMonth())

    setDateRange(getInitialDateRange(newInitialDate))
  }

  const onNext = () => {
    const newInitialDate = dateRange[1]
    newInitialDate.setMonth(newInitialDate.getUTCMonth() + 9)

    setDateRange(getInitialDateRange(newInitialDate))
  }

  useEffect(() => {
    if (data && data.groupedProtocolMonthData) {
      const newLabels = getMonthsBetweenDates(dateRange[0], dateRange[1])

      setLabels(newLabels)

      const monthDataInRange = data.groupedProtocolMonthData.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id >= dateRange[0] && id <= dateRange[1]
      }).map(monthData => {
        return {
          ...monthData,
          id: new Date(monthData.id).toLocaleString('default', {
            month: 'short',
            timeZone: 'UTC'
          })
        }
      })

      setCurrentData(newLabels.map(lbl => {
        const foundMonth = monthDataInRange.find(monthData => monthData.id === lbl)

        if (foundMonth) {
          return foundMonth.nonCumulativeCoverFee
        }
        return '0'
      }
      ).map(val => Number(convertFromUnits(val, liquidityTokenDecimals))))
    }
  }, [data, dateRange])

  const hasPrevious = useMemo(() => {
    if (data && data.groupedProtocolMonthData) {
      return data.groupedProtocolMonthData.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id < dateRange[0]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  const hasNext = useMemo(() => {
    if (data && data.groupedProtocolMonthData) {
      return data.groupedProtocolMonthData.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id > dateRange[1]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  return (
    <div className='flex flex-col flex-1 min-w-0 bg-white rounded-2xl shadow-homeCard px-6 py-8 lg:p-10 border-0.5 border-B0C4DB'>
      <div className='mb-8'>
        <div className='flex justify-between items-center'>
          <h1 className='mb-1 font-bold text-h2'>
            Analytics
          </h1>
          <div className='flex'>
            <ChevronLeftLgIcon onClick={hasPrevious ? onPrevious : undefined} className='w-4 h-4 mr-5 cursor-pointer' stroke={hasPrevious ? 'black' : '#999BAB'} />
            <ChevronRightLgIcon onClick={hasNext ? onNext : undefined} className='w-4 h-4 cursor-pointer' stroke={hasNext ? 'black' : '#999BAB'} />
          </div>
        </div>
      </div>
      <div
        className='flex-1 min-h-360'
      >
        <BarChart labels={labels} yAxisData={currentData} />
      </div>
    </div>
  )
}

export default CoverEarning
