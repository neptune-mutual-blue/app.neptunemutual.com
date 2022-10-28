import { ModalRegular } from '@/common/Modal/ModalRegular'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { classNames } from '@/utils/classnames'
import { Title } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'

export const DisclaimerModal = () => {
  const [disclaimerApproval, setDisclaimerApproval] = useLocalStorage(
    'disclaimerApproval',
    false
  )
  const [isOpen, setIsOpen] = useState(!disclaimerApproval)
  const [isAgreed, setIsAgreed] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleAccept = () => {
    setDisclaimerApproval(true)
    handleClose()
  }

  const handleDecline = () => {
    window.location.href = 'https://neptunemutual.com'
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    if (isAgreed) {
      handleAccept()
    }
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={handleClose}
      disabled
      data-testid='disclaimer-container'
    >
      <ModalWrapper className='max-w-5xl bg-FEFEFF'>
        <Title
          className='flex items-center font-semibold font-sora text-h4'
          data-testid='disclaimer-title'
        >
          <Trans>Disclaimer and Warranty</Trans>
        </Title>
        <div
          className='mt-6 pb-4 text-xs tracking-normal leading-4.5 sm:text-sm sm:leading-5 text-404040 flex flex-col gap-4 max-h-full sm:max-h-45vh overflow-y-auto pr-4 lg:pr-0 border-b border-f6f7f9'
          data-testid='disclaimer-description'
        >

          <p>
            <Trans>
              This testnet environment is built by Neptune Mutual, i.e. its
              operating entity Neptune Tech Limited and/or its affiliated
              companies (collectively “Neptune”).
            </Trans>
          </p>
          <p>
            <Trans>
              The purpose of this testnet environment is to test and conduct
              experiment on Neptune Mutual protocol without imposing risk to any
              digital assets or the main chain. Hence, this testnet environment
              is furnished for testing and experimenting only, and is subject to
              continuous updating, changing, improving, and/or periodically shut
              down without notice. The testnet environment may be malfunctioned,
              include technical errors or typographical errors. Any content,
              information, data, logo, including but not limited to covers
              providers, liquidity, protection policy are fictitious and should
              not be construed as a commitment by Neptune, and without
              warranties implied or statutory including without limitation
              warranties of merchantability, fitness for a particular use and
              non-infringement. Neptune accepts no responsibility or liability
              from any visitors on the testnet with regard to any issue incurred
              as a result of using or visiting the testnet environment.
            </Trans>
          </p>
          <p>
            <Trans>
              The cover creators, covers, covers availability, liquidity volume,
              protection amount, utilization ratio, as well as any other content
              in the testnet are fictitious and solely for the purpose of
              testing and experimenting. Neptune does not guarantee or warrant
              such information or content will be similar or close to the actual
              environment when the mainnet deploys. The logos and cover creators
              placed on the testnet are not intended to imply any official
              endorsement or commitment by those creators.
            </Trans>
          </p>
          <p>
            <Trans>
              Neptune may change this disclaimer at any time without notice to
              you and without liability to you or any other party. It is your
              responsibility to periodically check this disclaimer for changes.
              If you do not agree to any changes made to this disclaimer, you
              should cease use of this testnet.
            </Trans>
          </p>
        </div>

        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='flex items-start mt-3'>
            <input
              id='agreement-checkbox'
              name='agreement-checkbox'
              type='checkbox'
              checked={isAgreed}
              data-testid='disclaimer-checkbox'
              onChange={(e) => setIsAgreed(e.target.checked)}
              className='w-5 h-5 mt-1 bg-white border-2 rounded cursor-pointer checkbox_custom focus:ring-4e7dd9 text-4e7dd9 border-9B9B9B focus:border-4e7dd9 focus:ring focus:ring-offset-0 focus:ring-opacity-30'
            />

            <label
              htmlFor='agreement-checkbox'
              className='text-xs tracking-normal leading-4.5 sm:text-sm sm:leading-6 cursor-pointer text-404040 ml-3'
              data-testid='disclaimer-checkbox-label'
            >
              <Trans>
                By visiting this testnet environment, you acknowledge and agree
                the disclaimer as above and/or any changes made to this
                disclaimer.
              </Trans>
            </label>
          </div>

          <div className='flex flex-wrap justify-center w-full gap-4 mt-6 xs:justify-end sm:gap-6'>
            <button
              type='button'
              className='box-border p-3 font-medium border rounded-md border-4e7dd9 text-h6 text-4e7dd9'
              onClick={handleDecline}
              data-testid='disclaimer-decline'
            >
              <Trans>Decline</Trans>
            </button>
            <button
              type='submit'
              className={classNames(
                'box-border text-h6 font-medium rounded-md p-3 text-white bg-4e7dd9 bg-opacity-100 cursor-pointer pointer-events-auto border-4e7dd9',
                'disabled:bg-opacity-75 disabled:border-0 disabled:cursor-not-allowed'
              )}
              disabled={!isAgreed}
              data-testid='disclaimer-accept'
            >
              <Trans>Accept</Trans>
            </button>
          </div>
        </form>
      </ModalWrapper>
    </ModalRegular>
  )
}
