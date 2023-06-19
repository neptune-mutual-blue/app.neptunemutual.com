import { useCallback, useEffect, useRef } from 'react'

/**
 * @param {string} label
 * @returns {(endpoint: string, options: any) => Promise<any>}
 */
export function useFetch (label) {
  const controllerRef = useRef(null)

  const fetchFn = useCallback(
    async (endpoint, options = {}) => {
      controllerRef.current?.abort()
      controllerRef.current = new AbortController()

      try {
        const result = await fetch(
          endpoint,
          Object.assign(
            {
              signal: controllerRef.current.signal,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              }
            },
            options
          )
        )

        return result.json()
      } catch (e) {
        if (isAbortedRequest(e)) {
          console.log(`Aborted Request: ${label}`)

          return
        }

        // else rethrow error so we can catch it externally
        throw e
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
