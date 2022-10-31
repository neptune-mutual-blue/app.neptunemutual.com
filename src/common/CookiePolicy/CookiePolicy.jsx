import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { LocalStorage } from '@/utils/localstorage'

/**
 * @returns {boolean}
 */
const getLSAcceptedCookie = () => {
  return LocalStorage.get(
    LocalStorage.KEYS.COOKIE_POLICY,
    (value) => {
      const acceptedCookie = JSON.parse(value)

      if (typeof acceptedCookie === 'boolean') {
        return acceptedCookie
      }

      throw new Error(LocalStorage.LOCAL_STORAGE_ERRORS.INVALID_SHAPE)
    },
    false
  )
}

function CookiePolicy ({ isOpen, onClose }) {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as='div'
        className='fixed top-0 left-0 right-0 bottom-0 overflow-y-auto z-60'
        onClose={onClose}
      >
        <div className='min-h-full flex items-end justify-center'>
          <Transition.Child as={React.Fragment}>
            <Dialog.Overlay className='fixed top-0 left-0 right-0 bottom-0 bg-01052D bg-opacity-60' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='inline-block h-full align-bottom' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child as={React.Fragment}>
            <div className='overflow-hidden max-w-full xs:mx-1 sm:max-w-xl md:max-w-632 bg-F5F9FC backdrop-blur-3xl flex flex-col md:flex-row font-poppins text-left p-8 text-h6 items-center relative bottom-0 md:bottom-8 rounded-t-20 rounded-b-none md:rounded-b-20'>
              <p className='pb-4 md:pb-0 md:pr-4 tracking-normal'>
                <Trans>
                  We use third-party cookies in order to personalize your
                  experience.
                </Trans>
              </p>
              <div className='whitespace-nowrap text-sm flex w-full md:w-auto font-sora'>
                <button
                  className='border-4e7dd9 border-solid border text-4e7dd9 py-3 md:py-2 mr-4 md:mr-2 rounded-1 w-105px text-h7 flex-grow'
                  onClick={onClose}
                >
                  <Trans>Decline</Trans>
                </button>
                <button
                  className='border-4e7dd9 border-solid border bg-4e7dd9 text-white py-3 md:py-2 rounded-1 w-105px text-h7 flex-grow'
                  onClick={() => {
                    LocalStorage.set(LocalStorage.KEYS.COOKIE_POLICY, true)
                    onClose()
                  }}
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
