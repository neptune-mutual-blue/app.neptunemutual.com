import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

/**
 * @typedef {Object} ReturnType
 * @property {boolean} isRetrying - A boolean representing whether the function is currently retrying.
 * @property {() => void} stopRetrying - A function that stops the retrying of the function.
 * @property {() => void} restartRetrying - A function that restarts the retrying of the function.
 *
 * Custom hook that allows retrying a function a specified number of times with a delay between each retry.
 * @param {() => Promise<void>} fn - The function to be retried.
 * @param {Object} options - Optional configuration options.
 * @param {number} options.retries - The number of times to retry the function. Default is 3.
 * @param {number} options.delay - The delay in milliseconds between each retry. Default is 1000ms.
 * @returns {ReturnType} An object containing the retry control functions.
 */
export const useRetry = (fn, { retries = 3, delay = 1000 } = { retries: 3, delay: 1000 }) => {
  const [fnObj, setFnObj] = useState({ fn })
  const [isRetrying, setIsRetrying] = useState(false)

  const ref = useRef({ continueRetrying: false, ran: 0 })

  const shouldRun = useCallback(() => {
    // Stop after running the function the specified number of times
    // or if the explicitly called `stopRetrying` function
    return retries > 0 && ref.current.continueRetrying && ref.current.ran < retries
  }, [retries])

  const stopRetrying = useCallback(() => {
    setIsRetrying(false)
    ref.current.continueRetrying = false
  }, [])

  const restartRetrying = useCallback(() => {
    ref.current.continueRetrying = true
    ref.current.ran = 0

    // update the fn object to trigger the useEffect
    setFnObj(prev => { return { fn: prev.fn } })
    setIsRetrying(true)
  }, [])

  useEffect(() => {
    if (!shouldRun()) {
      setIsRetrying(false)

      return
    }

    let interval = null

    interval = setInterval(() => {
      if (!shouldRun()) {
        setIsRetrying(false)
        clearInterval(interval)

        return
      }

      ref.current.ran = ref.current.ran + 1

      fnObj.fn()
    }, delay)

    return () => { return clearInterval(interval) }
  }, [delay, fnObj, shouldRun])

  return {
    isRetrying,
    stopRetrying,
    restartRetrying
  }
}
