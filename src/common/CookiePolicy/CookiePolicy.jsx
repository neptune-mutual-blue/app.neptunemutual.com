import React from 'react'

import { useCookies } from '@/src/context/Cookie'
import { LocalStorage } from '@/utils/localstorage'
import {
  Dialog,
  Transition
} from '@headlessui/react'
import { Trans } from '@lingui/macro'

/**
 * @returns {boolean}
 */
const getLSAcceptedCookie = () => {
  if (typeof window === 'undefined') {
    return
  }

  const value = window.localStorage.getItem(LocalStorage.KEYS.COOKIE_POLICY)

  if (typeof value === 'string') {
    return JSON.parse(value)
  }
}

function CookiePolicy ({ isOpen, onClose }) {
  const { setAccepted } = useCookies()

  const handleClose = () => {
    onClose()
  }

  const handleAccepted = () => {
    setAccepted(true)
    onClose()
  }

  const handleDecline = () => {
    setAccepted(false)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as='div'
        className='fixed top-0 bottom-0 left-0 right-0 overflow-y-auto z-60'
        onClose={handleClose}
      >
        <div className='flex items-end justify-center min-h-full'>
          <Transition.Child as={React.Fragment}>
            <Dialog.Overlay className='fixed top-0 bottom-0 left-0 right-0 bg-01052D bg-opacity-60' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='inline-block h-full align-bottom' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child as={React.Fragment}>
            <div className='relative bottom-0 flex flex-col items-center max-w-full px-8 py-6 overflow-hidden text-left rounded-b-none xs:mx-1 sm:max-w-xl md:max-w-2xl bg-F5F9FC backdrop-blur-3xl md:flex-row text-md md:bottom-8 rounded-t-2xl md:rounded-b-2xl'>
              <p className='pb-4 tracking-normal md:pb-0 md:pr-4'>
                <Trans>
                  We use third-party cookies in order to personalize your
                  experience.
                </Trans>
              </p>
              <div className='flex w-full text-sm whitespace-nowrap md:w-auto'>
                <button
                  className='flex-grow px-6 py-4 mr-4 tracking-wide uppercase border border-solid border-4E7DD9 text-003fbd md:py-2 rounded-1 min-w-60 md:mr-2'
                  onClick={handleDecline}
                >
                  <Trans>Decline</Trans>
                </button>
                <button
                  className='flex-grow px-6 py-4 tracking-wide text-white uppercase border border-solid border-2151B0 bg-2151B0 md:py-2 rounded-1 min-w-60'
                  onClick={handleAccepted}
                >
                  <Trans>Accept</Trans>
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export { CookiePolicy, getLSAcceptedCookie }
