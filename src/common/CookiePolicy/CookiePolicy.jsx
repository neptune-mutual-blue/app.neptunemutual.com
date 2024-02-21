import React from 'react'

import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { useCookies } from '@/src/context/Cookie'
import {
  Dialog,
  Transition
} from '@headlessui/react'
import { Trans } from '@lingui/macro'

export function CookiePolicy ({ isOpen, onClose }) {
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
                <OutlinedButton
                  className='flex-grow px-6 py-4 mr-4 tracking-wide uppercase font-medium bg-opacity-50 border border-solid text-primary md:py-2 rounded-1 min-w-60 md:mr-2 hover:bg-opacity-10 hover:bg-primary'
                  onClick={handleDecline}
                >
                  <Trans>Decline</Trans>
                </OutlinedButton>
                <RegularButton
                  className='flex-grow px-6 py-4 tracking-wide text-white uppercase font-medium border border-solid md:py-2 !rounded-1 min-w-60'
                  onClick={handleAccepted}
                >
                  <Trans>Accept</Trans>
                </RegularButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
