import { useState } from 'react'

import { t, Trans } from '@lingui/macro'
import { CalculatorCardTitle } from '@/src/modules/analytics/CalculatorCardTitle'
import { classNames } from '@/utils/classnames'

import { useAppConstants } from '@/src/context/AppConstants'
import { PolicyCalculation } from '@/src/modules/analytics/PolicyCalculation'
import { DateRangePicker } from '@/src/modules/analytics/DateRangePicker'
import { CoverOptions } from '@/src/modules/analytics/CoverOptions'
import { CalculatorAmountHandler } from '@/src/modules/analytics/CalculatorAmountHandler'
import { InputLabel } from '@/src/modules/analytics/InputLabel'
import { isValidProduct } from '@/src/helpers/cover'
import { calculateCoverPolicyFee } from '@/utils/calculateCoverPolicyFee'
import { useWeb3React } from '@web3-react/core'

export const CalculatorCard = () => {
  const { account, library } = useWeb3React()

  const {
    liquidityTokenDecimals,
    liquidityTokenSymbol
  } = useAppConstants()
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [resultLoading, setResultLoading] = useState(false)

  function handleChange (val) {
    setError('')
    setAmount(val)
  }

  const buttonBg = 'bg-5D52DC'

  const [coverMonth, setCoverMonth] = useState('')

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value)
  }

  const [selectedCover, setSelectedCover] = useState(null)

  const calculatePolicyFee = async () => {
    setResultLoading(true)
    const data = await calculateCoverPolicyFee({
      value: amount,
      account,
      library,
      coverKey: selectedCover?.coverKey || '',
      productKey: isValidProduct(selectedCover?.productKey) && (selectedCover?.productKey || ''),
      coverMonth,
      liquidityTokenDecimals
    })

    setResult(data)
    setResultLoading(false)
  }

  return (
    <>
      <div className='pb-4 lg:pb-6'>
        <CalculatorCardTitle text='Calculator ' />
      </div>
      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Select a cover' />
        <CoverOptions selected={selectedCover} setSelected={setSelectedCover} />
      </div>

      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Amount you wish to cover' />
        <CalculatorAmountHandler
          error={Boolean(error)}
          value={amount}
          buttonProps={{
            children: t`Max`,
            onClick: () => {},
            buttonClassName: 'hidden'
          }}
          unit={liquidityTokenSymbol}
          inputProps={{
            id: 'cover-amount',
            placeholder: t`Enter Amount`,
            value: amount,
            disabled: resultLoading,
            onChange: handleChange,
            allowNegativeValue: false
          }}
        />
      </div>
      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Set expiry' />
        <DateRangePicker
          handleRadioChange={handleRadioChange}
          coverMonth={coverMonth}
          disabled={resultLoading}
        />
      </div>

      <div className='pb-4 lg:pb-7'>
        <button
          type='button'
          disabled={!amount || !coverMonth || resultLoading || !account}
          className={classNames(
            'block w-full pt-3 pb-3 uppercase px-4 py-0 text-sm font-semibold tracking-wider leading-loose text-white border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75',
            buttonBg,
            amount === '' || coverMonth === '' ? 'cursor-not-allowed disabled:opacity-75' : ''
          )}
          title={t`Calculate policy fee`}
          onClick={calculatePolicyFee}
        >
          <span className='sr-only'>{t`Calculate policy fee`}</span>
          <Trans>Calculate policy fee</Trans>
        </button>
      </div>
      <PolicyCalculation
        feeData={result}
        loading={resultLoading}
        linkDisabled={!amount || !coverMonth}
        selected={selectedCover}
        amount={amount}
        coverMonth={coverMonth}
      />
    </>
  )
}
