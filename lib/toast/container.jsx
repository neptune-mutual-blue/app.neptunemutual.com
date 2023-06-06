/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */

import React, { useCallback } from 'react'
import { classNames } from './utils'
import ToastMessage from './message'
import { useToast } from './context'

const VARIANTS = {
  top_left: {
    style: 'top-0 left-0'
  },
  top_right: {
    style: 'top-15% max-h-80% right-0'
  },
  bottom_right: {
    style: 'bottom-0 right-0'
  },
  bottom_left: {
    style: 'bottom-0 left-0'
  },
  top_middle: {
    style: 'top-0 left-1/2 -translate-x-1/2 transform'
  },
  bottom_middle: {
    style: 'bottom-0 left-1/2 -translate-x-1/2 transform'
  },
  undefined: {
    style: 'top-0 right-0'
  }
}

const ToastContainer = ({ variant = 'top_right', data, hidden }) => {
  const context = useToast()
  const Var = VARIANTS[variant] || VARIANTS.top_right

  const handleRemove = useCallback((id) => {
    context.remove(id)
  }, [context])

  return (
    <div
      className={classNames(
        Var.style,
        'fixed z-60 w-full md:max-w-sm',
        'px-4 mr-2 overflow-x-hidden overflow-y-auto',
        hidden && 'hidden'
      )}
      data-testid='toast-container'
    >
      <div
        className={classNames(
          'flex-1 flex-col fade w-full mr-8 justify-end pointer-events-none'
        )}
      >
        {data.map((toast) => {
          return (
            <div
              key={toast.id}
              className={classNames(
                'flex py-1 w-full',
                'transform transition-all duration-300 pointer-events-auto'
              )}
            >
              <ToastMessage
                id={toast.id}
                message={toast.message}
                type={toast.type}
                header={toast.header}
                icon={toast.icon}
                title={toast.title}
                onRemove={handleRemove}
                lifetime={toast.lifetime}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ToastContainer
