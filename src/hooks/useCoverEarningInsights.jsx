import { getMonthsBetweenDates } from '@/lib/dates'
import { useAppConstants } from '@/src/context/AppConstants'
import { useProtocolMonthData } from '@/src/hooks/useProtocolMonthData'
import { convertFromUnits } from '@/utils/bn'
import { useEffect, useMemo, useState } from 'react'

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

function useCoverEarningInsights () {
  const [dateRange, setDateRange] = useState(getInitialDateRange(new Date()))

  const { data, loading, fetchData } = useProtocolMonthData()

  const { liquidityTokenDecimals } = useAppConstants()

  const [yAxisData, setYAxisData] = useState([])

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
    if (data) {
      const newLabels = getMonthsBetweenDates(dateRange[0], dateRange[1])

      setLabels(newLabels)

      const monthDataInRange = data.filter((monthData) => {
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

      setYAxisData(newLabels.map(lbl => {
        const foundMonth = monthDataInRange.find(monthData => { return monthData.id === lbl })

        if (foundMonth) {
          return foundMonth.nonCumulativeCoverFee
        }

        return '0'
      }
      ).map(val => { return Number(convertFromUnits(val, liquidityTokenDecimals)) }))
    }
  }, [data, dateRange, liquidityTokenDecimals])

  const hasPrevious = useMemo(() => {
    if (data) {
      return data.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id < dateRange[0]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  const hasNext = useMemo(() => {
    if (data) {
      return data.filter((monthData) => {
        const monthDate = new Date(monthData.id)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id > dateRange[1]
      }).length > 0
    } else {
      return false
    }
  }, [data, dateRange])

  return {
    hasNext,
    hasPrevious,
    onNext,
    onPrevious,
    labels,
    yAxisData,
    loading,
    fetchData
  }
}

export default useCoverEarningInsights
