import { useState } from 'react'

import { useRouter } from 'next/router'

import { CoverTermsModal } from '@/common/CoverForm/CoverTermsModal'
import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
import { useNPMSwapLink } from '@/common/NPMSwapLink'
import AddCircleIcon from '@/icons/AddCircleIcon'
import StandardTermsConditionsIcon from '@/icons/StandardTermsConditionsIcon'
import {
  MAX_PROPOSAL_AMOUNT,
  MIN_PROPOSAL_AMOUNT
} from '@/src/config/constants'
import {
  isGreater,
  isGreaterOrEqual
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'

const PurchaseAmountStep = ({
  setValue,
  liquidityTokenSymbol,
  liquidityTokenDecimals,
  value,
  approving,
  purchasing,
  availableLiquidity,
  coverKey,
  productKey,
  projectOrProductName,
  parameters,
  imgSrc,
  isPurchaseDisabled
}) => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  function handleChange (val) {
    setError('')
    setValue(val)

    if (isGreaterOrEqual(val, availableLiquidity)) {
      const maxProtection = formatCurrency(availableLiquidity, router.locale, liquidityTokenSymbol, true).long
      setError(`Maximum protection available is ${maxProtection}` + '. Choose a amount less than available.')
    } else if (isGreater(val, MAX_PROPOSAL_AMOUNT)) {
      const maxThreshold = formatCurrency(MAX_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      setError(`Maximum proposal threshold is ${maxThreshold}`)
    } else if (isGreater(MIN_PROPOSAL_AMOUNT, val)) {
      const minThreshold = formatCurrency(MIN_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      setError(`Minimum proposal threshold is ${minThreshold}`)
    }
  }

  const handleShowCoverTerms = () => {
    setShowModal(true)
  }

  const npmSwapLink = useNPMSwapLink()

  return (
    <>
      <p className='font-bold text-center text-display-xs text-01052D'>
        How Much Protection Do You Require?
      </p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>
        Don&apos;t worry, you&apos;re not required to make a purchase just yet.
      </p>
      <InputWithTrailingButton
        decimalLimit={liquidityTokenDecimals}
        error={!!error}
        buttonProps={{
          children: 'Max',
          onClick: () => {},
          disabled: approving || purchasing,
          buttonClassName: 'hidden'
        }}
        unit={liquidityTokenSymbol}
        unitClass='!text-black font-semibold'
        inputProps={{
          id: 'cover-amount',
          disabled: approving || purchasing,
          placeholder: 'Enter Amount',
          value: value,
          onChange: handleChange,
          allowNegativeValue: false,
          'data-testid': 'input-field'
        }}
        disabled={isPurchaseDisabled}
      />
      {error && error !== 'Please connect your wallet' && <p className='flex items-center text-FA5C2F'>{error}</p>}

      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>Maximum Available: {formatCurrency(availableLiquidity, router.locale).short}</div>

      <div className='flex items-center justify-center gap-6 mt-8'>
        <button
          className='flex items-center p-1 pr-0 text-sm font-semibold text-primary'
          onClick={handleShowCoverTerms}
        >
          <StandardTermsConditionsIcon />
          <p className='text-sm'>View Cover Parameters</p>
        </button>

        <a
          className='flex p-1 pr-0 items-center text-sm font-semibold uppercase text-primary gap-0.5'
          href={npmSwapLink}
          target='_blank'
          rel='noreferrer'
        >
          <AddCircleIcon width='24' height='24' />
          Get NPM
        </a>
      </div>

      {showModal && (
        <CoverTermsModal
          setShowModal={setShowModal}
          coverKey={coverKey}
          productKey={productKey}
          projectOrProductName={projectOrProductName}
          parameters={parameters}
          imgSrc={imgSrc}
        />
      )}
    </>
  )
}

export default PurchaseAmountStep
