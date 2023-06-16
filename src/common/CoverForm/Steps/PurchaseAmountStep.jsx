import { useState } from 'react'

import { useRouter } from 'next/router'

import { CoverTermsModal } from '@/common/CoverForm/CoverTermsModal'
import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
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
import {
  t,
  Trans
} from '@lingui/macro'

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
  imgSrc
}) => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  function handleChange (val) {
    setError('')
    setValue(val)

    if (isGreaterOrEqual(val, availableLiquidity)) {
      setError(t`Maximum protection available is ${formatCurrency(availableLiquidity, router.locale, liquidityTokenSymbol, true).long}` + '. Choose a amount less than available.')
    } else if (isGreater(val, MAX_PROPOSAL_AMOUNT)) {
      setError(t`Maximum proposal threshold is ${formatCurrency(MAX_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long}`)
    } else if (isGreater(MIN_PROPOSAL_AMOUNT, val)) {
      setError(t`Minimum proposal threshold is ${formatCurrency(MIN_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long}`)
    }
  }

  const handleShowCoverTerms = () => {
    setShowModal(true)
  }

  return (
    <>
      <p className='font-bold text-center text-display-xs text-01052D'>
        <Trans>How Much Protection Do You Require?</Trans>
      </p>
      <p className='mt-1 mb-8 text-lg text-center text-999BAB'>
        <Trans>Don&apos;t worry, you&apos;re not required to make a purchase just yet.</Trans>
      </p>
      <InputWithTrailingButton
        decimalLimit={liquidityTokenDecimals}
        error={!!error}
        buttonProps={{
          children: t`Max`,
          onClick: () => {},
          disabled: approving || purchasing,
          buttonClassName: 'hidden'
        }}
        unit={liquidityTokenSymbol}
        unitClass='!text-black font-semibold'
        inputProps={{
          id: 'cover-amount',
          disabled: approving || purchasing,
          placeholder: t`Enter Amount`,
          value: value,
          onChange: handleChange,
          allowNegativeValue: false,
          'data-testid': 'input-field'
        }}
      />
      {error && error !== 'Please connect your wallet' && <p className='flex items-center text-FA5C2F'>{error}</p>}

      <div className='w-full px-8 py-6 mt-8 text-center rounded-lg bg-F3F5F7'>Maximum Available: {formatCurrency(availableLiquidity, router.locale).short}</div>
      <button
        className='flex items-center gap-2 p-1 pr-0 mx-auto mt-8 text-primary'
        onClick={handleShowCoverTerms}
      >
        <StandardTermsConditionsIcon />
        <p className='text-sm'>View Cover Parameters</p>
      </button>

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
