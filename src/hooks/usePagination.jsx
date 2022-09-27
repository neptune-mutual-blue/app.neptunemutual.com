import { ROWS_PER_PAGE } from '@/src/config/constants'
import { useState, useEffect } from 'react'

export const usePagination = (props) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(props?.defaultLimit || ROWS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [limit, props?.defaultLimit])

  return {
    page,
    limit,
    setPage,
    setLimit
  }
}
