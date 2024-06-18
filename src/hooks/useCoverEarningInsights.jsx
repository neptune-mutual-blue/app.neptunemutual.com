import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  formatDateByLocale,
  getMonthsBetweenDates
} from '@/lib/dates'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useLanguageContext } from '@/src/i18n/i18n'
import { getCoverEarnings } from '@/src/services/api/home/charts/cover-earnings'
import { toBN } from '@/utils/bn'

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

  const { networkId } = useNetwork()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const { liquidityTokenDecimals } = useAppConstants()

  const [yAxisData, setYAxisData] = useState([])

  const { locale } = useLanguageContext()

  const [labels, setLabels] = useState(getMonthsBetweenDates(locale, dateRange[0], dateRange[1]))

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

  const fetchData = useCallback(() => {
    getCoverEarnings(networkId)
      .then((_data) => {
        if (_data) {
          setData(_data)
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [networkId])

  useEffect(() => {
    if (data) {
      const newLabels = getMonthsBetweenDates(locale, dateRange[0], dateRange[1])

      setLabels(newLabels)

      const monthDataInRange = data.filter((monthData) => {
        const monthDate = new Date(monthData.startDate)
        const id = new Date(monthDate.getTime() + monthDate.getTimezoneOffset() * 60 * 1000)

        return id >= dateRange[0] && id <= dateRange[1]
      }).map(monthData => {
        return {
          ...monthData,
          id: formatDateByLocale(locale, monthData.endDate, { timeZone: 'UTC' })
        }
      })

      setYAxisData(newLabels.map(lbl => {
        const foundMonth = monthDataInRange.find(monthData => { return monthData.id === lbl })

        if (foundMonth) {
          return foundMonth.totalCoverFeeEarned
        }

        return '0'
      }
      ).map(val => { return toBN(val || 0).toNumber() }))
    }
  }, [data, dateRange, liquidityTokenDecimals, locale])

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
