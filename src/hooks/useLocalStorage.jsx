import { useEffect, useState } from 'react'

export const useLocalStorage = (key, initialState) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const item = localStorage.getItem(key)

    if (item) {
      setState(parse(item))
    }
  }, [key])

  useEffect(() => {
    if (typeof state === 'undefined') {
      localStorage.removeItem(key)
      return
    }

    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

const parse = (value) => {
  try {
    return JSON.parse(value)
  } catch (_a) {
    return value
  }
}
