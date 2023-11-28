import {
  useEffect,
  useState
} from 'react'

const defaultState = {
  hours: 0,
  minutes: 0,
  seconds: 0
}

export const useCountdown = ({ target, getTime }) => {
  const [state, setState] = useState(defaultState)

  useEffect(() => {
    let ignore = false
    const updateState = (_intervalId) => {
      const now = getTime()
      const diff = target - now

      if (diff < 0) {
        clearInterval(_intervalId)

        return
      }

      const seconds = diff % 60
      const minutes = (diff / 60) % 60
      const hours = diff / (60 * 60)

      /* istanbul ignore next */
      if (ignore) {
        return
      }

      setState({
        seconds: Math.floor(seconds),
        minutes: Math.floor(minutes),
        hours: Math.floor(hours)
      })
    }

    const intervalId = window.setInterval(() => {
      updateState(intervalId)
    }, 1000)

    return () => {
      ignore = true
      clearInterval(intervalId)
    }
  }, [getTime, target])

  return state
}
