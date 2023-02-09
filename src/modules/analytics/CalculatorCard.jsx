import { useState, useEffect} from 'react'


import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { t, Trans } from '@lingui/macro'
import { CalculatorCardTitle } from '@/src/modules/analytics/CalculatorCardTitle'
import { classNames } from '@/utils/classnames'

import { formatCurrency } from '@/utils/formatter/currency'
import {isGreaterOrEqual} from '@/utils/bn'

import { useAppConstants } from '@/src/context/AppConstants'
import { PolicyCalculation } from '@/src/modules/analytics/PolicyCalculation'
import { DateRangePicker } from '@/src/modules/analytics/DateRangePicker'
import { CoverOptions } from '@/src/modules/analytics/CoverOptions'
import { AmountHandler } from '@/src/modules/analytics/AmountHandler'

export const CalculatorCard = ({ value, approving, purchasing}) => {
  const {
    liquidityTokenDecimals,
    liquidityTokenSymbol
  } = useAppConstants()

  const [error, setError] = useState('')
  const [val, setValue] = useState('')

  function handleChange (val) {
    setError('')
    setValue(val)

    if (isGreaterOrEqual(val, availableLiquidity)) {
      setError(t`Maximum protection available is ${
        formatCurrency(availableLiquidity, router.locale, liquidityTokenSymbol, true).long
      }` + '. Choose a amount less than available.')
    } else if (isGreater(val, MAX_PROPOSAL_AMOUNT)) {
      setError(t`Maximum proposal threshold is ${
        formatCurrency(MAX_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      }`)
    } else if (isGreater(MIN_PROPOSAL_AMOUNT, val)) {
      setError(t`Minimum proposal threshold is ${
        formatCurrency(MIN_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      }`)
    }
  }


  const buttonBg = 'bg-5D52DC'
  const searchClass = ''
  const inputClass = ''
  const reportingResolved = ''
  const sortType = ''
  const setSortType = ''
  const defaultOptions = [
    { name: t`OKEX Exchange`, value: 'SORT_TYPES.ALPHABETIC' },
    { name: t`Utilization ratio`, value: 'SORT_TYPES.UTILIZATION_RATIO' },
    { name: t`Liquidity`, value: 'SORT_TYPES.LIQUIDITY' }
  ]
  const [selected, setSelected] = useState(defaultOptions[0])



  return (
    <>
      <div className='pb-8'>
        <CalculatorCardTitle text={"Calculator "} />
      </div>
      <div className="pb-8">
        <div className='block uppercase font-semibold pb-2'>
          Select a cover
        </div>
        <CoverOptions defaultOptions={defaultOptions} selected={selected} setSortType={setSortType} setSelected={setSelected} />
      </div>

      <div className='pb-8'>
        <div className='block uppercase font-semibold pb-2'>
          Amount you wish to cover
        </div>
        <AmountHandler liquidityTokenDecimals={liquidityTokenDecimals} 
          liquidityTokenSymbol={liquidityTokenSymbol}
          error={error} 
          approving={approving} purchasing={purchasing} value={val} handleChange={handleChange} />
      </div>

      <div className='pb-8'>
        <div className='block uppercase font-semibold pb-2'>
          Set expiry
        </div>
        <DateRangePicker approving={approving} purchasing={purchasing} />
      </div>

      <div>
        <button
          className={classNames(
            'block w-full pt-3 pb-3 uppercase px-4 py-0 text-sm font-semibold tracking-wider leading-loose text-white border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75',
            buttonBg
          )}
          title={t`Calculate policy fee`}
        >
          <span className='sr-only'>{t`Calculate policy fee`}</span>
          <Trans>Calculate policy fee</Trans>
        </button>
      </div>

      <PolicyCalculation />
    </>
  )
}