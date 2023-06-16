import {
  useCallback,
  useEffect,
  useRef
} from 'react'

import { getGraphURL } from '@/src/config/environment'

export const ERRORS_SUBGRAPH = {
  UNKNOWN_SUBGRAPH_URL: 'UNKNOWN_SUBGRAPH_URL',
  SUBGRAPH_DATA_ERROR: 'SUBGRAPH_DATA_ERROR',
  REQUEST_ABORTED: 'REQUEST_ABORTED'
}

/**
 * @param {string} label
 * @returns {(networkId: number, query: string) => Promise<any>}
 */
export function useSubgraphFetch (label) {
  const controllerRef = useRef(null)

  const fetchFn = useCallback(
    async (networkId, query) => {
      if (!networkId) {
        return null
      }

      const graphURL = getGraphURL(networkId)

      if (!graphURL) {
        throw new Error(ERRORS_SUBGRAPH.UNKNOWN_SUBGRAPH_URL)
      }

      controllerRef.current?.abort()
      controllerRef.current = new AbortController()

      try {
        const response = await fetch(graphURL, {
          signal: controllerRef.current.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            query
          })
        })

        const { data, errors } = await response.json()

        if (errors) {
          throw new Error(ERRORS_SUBGRAPH.SUBGRAPH_DATA_ERROR)
        }

        return data
      } catch (error) {
        if (isAbortedRequest(error)) {
          console.log(`Aborted Request: ${label}`)

          return
        }

        // else rethrow error so we can catch it externally
        throw error
      }
    },
    [label]
  )

  useEffect(() => {
    // Abort request on unmount
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  return fetchFn
}

/**
 * @param {{ message: string }} errorMessage
 */
function isAbortedRequest (errorMessage) {
  return errorMessage.message.includes('The user aborted a request')
}
