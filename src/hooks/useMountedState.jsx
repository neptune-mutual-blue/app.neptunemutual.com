import { useEffect, useRef, useCallback } from 'react'

// returns a function that when called will
// return `true` if the component is mounted
export const useMountedState = () => {
  const mountedRef = useRef(false)
  const isMounted = useCallback(() => { return mountedRef.current }, [])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  return isMounted
}
