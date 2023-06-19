/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */
import React, { useCallback, useState, useMemo } from 'react'

import ToastContainer from './container'
import { ToastContext } from './context'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_INTERVAL = 30000 // 30 seconds

/**
 * Implementation
 *
 * @param {object} param
 * @param {string} param.variant
 * @param {JSX.Element | undefined} [param.children]
 */
export const ToastProvider = ({ children, variant }) => {
  const [data, setData] = useState([])

  const [hidden, setHidden] = useState(false)

  const Push = useCallback(
    (message, type, lifetime, title) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          type: type,
          lifetime: lifetime || DEFAULT_INTERVAL,
          title
        }
        setData((prevState) => { return [...prevState, newItem] })

        return newItem.id
      }
    },
    [setData]
  )
  const PushCustom = useCallback(
    ({ message, lifetime, icon, header }) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          lifetime: lifetime || DEFAULT_INTERVAL,
          icon: icon,
          header: header,
          type: undefined
        }
        setData((prevState) => { return [...prevState, newItem] })

        return newItem.id
      }
    },
    [setData]
  )
  const PushError = useCallback(
    ({ message, title = 'Error', lifetime }) => { return Push(message, 'Error', lifetime, title) },
    [Push]
  )
  const PushWarning = useCallback(
    ({ message, title = 'Warning', lifetime }) => { return Push(message, 'Warning', lifetime, title) },
    [Push]
  )
  const PushSuccess = useCallback(
    ({ message, title = 'Success', lifetime }) => { return Push(message, 'Success', lifetime, title) },
    [Push]
  )
  const PushInfo = useCallback(
    ({ message, title = 'Info', lifetime }) => { return Push(message, 'Info', lifetime, title) },
    [Push]
  )
  const PushLoading = useCallback(
    ({ message, title = 'Loading', lifetime }) => { return Push(message, 'Loading', lifetime, title) },
    [Push]
  )
  const remove = useCallback(async (id) => {
    setData((prevState) => { return prevState.filter((e) => { return e.id !== id }) })
  }, [])

  const hide = useCallback(async (status) => {
    setHidden(status)
  }, [])

  const toastFunctions = useMemo(
    () => {
      return {
        pushError: PushError,
        pushWarning: PushWarning,
        pushSuccess: PushSuccess,
        pushInfo: PushInfo,
        pushLoading: PushLoading,
        push: Push,
        pushCustom: PushCustom,
        remove,
        hide
      }
    },
    [
      Push,
      PushCustom,
      PushError,
      PushInfo,
      PushLoading,
      PushSuccess,
      PushWarning,
      remove,
      hide
    ]
  )

  return (
    <ToastContext.Provider value={toastFunctions}>
      <ToastContainer variant={variant} data={data} hidden={hidden} />
      {children}
    </ToastContext.Provider>
  )
}
