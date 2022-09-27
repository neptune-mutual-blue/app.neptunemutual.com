import { useState } from 'react'

/**
 * @template T
 *
 * @param  {{
 * list: T[],
 * filter: (item: T, search: string) => boolean
 * }} param
 */
export const useSearchResults = ({ list, filter }) => {
  const [searchValue, setSearchValue] = useState('')

  const filtered = list.filter((item) => {
    try {
      return filter(item, searchValue)
    } catch (err) {
      /* swallow */
    }

    return true
  })

  return {
    searchValue,
    setSearchValue,
    filtered
  }
}
