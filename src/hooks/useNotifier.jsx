import { useToast } from '@/lib/toast/context'
import { TOAST_DEFAULT_TIMEOUT } from '@/src/config/toast'
import { useCallback } from 'react'

export const useNotifier = () => {
  const toast = useToast()

  const notifier = useCallback(
    (notification) => {
      if (notification.type === 'error') {
        const { error, ...rest } = notification

        console.error(error)
        toast.pushError({
          title: rest.title,
          message: rest.message,
          lifetime: TOAST_DEFAULT_TIMEOUT
        })
      }
    },
    [toast]
  )

  return { notifier }
}
