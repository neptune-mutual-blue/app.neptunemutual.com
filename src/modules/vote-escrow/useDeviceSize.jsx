import {
  useCallback,
  useEffect,
  useState
} from 'react'

export const useDeviceSize = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 475)
  }, [])

  // choose the screen size
  const handleResize = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [])

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return {
    isMobile
  }
}
