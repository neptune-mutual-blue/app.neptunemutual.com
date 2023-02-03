import { ROWS_PER_PAGE } from '@/src/config/constants'
import { useState, useEffect } from 'react'

export const usePagination = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(ROWS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [limit])

  return {
    page,
    limit,
    setPage,
    setLimit
  }
}
