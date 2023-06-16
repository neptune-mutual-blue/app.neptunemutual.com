import React, {
  useCallback,
  useMemo,
  useState
} from 'react'

const defaultValue = {
  setStatsByKey: (_key, _obj) => {},
  getStatsByKey: (_key) => { return {} }
}

const SortableStatsContext = React.createContext(defaultValue)

/**
 * @description DO NOT use `setStatsByKey` and `getStatsByKey` in the same effect (`useEffect`, `useCallback` or `useMemo`)
 *
 * Used for storing and sorting the data fetched when each card is loaded (like APR)
 */
export function useSortableStats () {
  const context = React.useContext(SortableStatsContext)
  if (context === undefined) {
    throw new Error(
      'useSortableStats must be used within a SortableStatsProvider'
    )
  }

  return context
}

/** Used Only For Sorting */
export const SortableStatsProvider = ({ children }) => {
  const [state, setState] = useState(defaultValue)

  const setStatsByKey = useCallback((key, obj) => {
    setState((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          ...obj
        }
      }
    })
  }, [])

  const getStatsByKey = useCallback((key) => { return state[key] || {} }, [state])

  return (
    <SortableStatsContext.Provider
      value={useMemo(
        () => { return { getStatsByKey, setStatsByKey } },
        [getStatsByKey, setStatsByKey]
      )}
    >
      {children}
    </SortableStatsContext.Provider>
  )
}
