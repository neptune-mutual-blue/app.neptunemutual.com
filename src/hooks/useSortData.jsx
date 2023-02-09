import { sortDataByKey } from '@/utils/sorting'
import { useEffect, useState } from 'react'

export const useSortData = ({ data }) => {
  const [sorts, setSorts] = useState({})
  const [sortedData, setSortedData] = useState(data)

  useEffect(() => {
    setSortedData(data)
  }, [data])

  const handleSort = (sortKey, sortType) => {
    const _sorts = {
      ...sorts,
      [sortKey]: !sorts[sortKey]
        ? { type: 'asc', key: sortType }
        : {
            ...sorts[sortKey],
            type: sorts[sortKey].type === 'asc' ? 'desc' : 'asc'
          }
    }
    setSorts(_sorts)

    const _sortedData = sortDataByKey(data, sortType, _sorts[sortKey].type)
    setSortedData([..._sortedData])
  }

  return {
    sorts,
    handleSort,
    sortedData
  }
}
