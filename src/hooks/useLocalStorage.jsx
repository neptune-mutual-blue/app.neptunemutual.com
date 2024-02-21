import {
  useEffect,
  useState
} from 'react'

// Hook
export function useLocalStorage (key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState(initialValue)
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.

  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)

      if (item) { setStoredValue(JSON.parse(item)) }
    } catch (error) {
      // If error also return initialValue
      console.log(error)
    }
  }, [key])

  const setValue = (value) => {
    if (typeof window === 'undefined') { return }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
