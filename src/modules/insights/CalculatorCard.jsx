import {
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import {
  MAX_PROPOSAL_AMOUNT,
  MIN_PROPOSAL_AMOUNT
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { getErrorMessage } from '@/src/helpers/tx'
import { useCoverDropdown } from '@/src/hooks/useCoverDropdown'
import { useNotifier } from '@/src/hooks/useNotifier'
import {
  CalculatorAmountHandler
} from '@/src/modules/insights/CalculatorAmountHandler'
import { CalculatorCardTitle } from '@/src/modules/insights/CalculatorCardTitle'
import { CoverOptions } from '@/src/modules/insights/CoverOptions'
import { DateRangePicker } from '@/src/modules/insights/DateRangePicker'
import { InputLabel } from '@/src/modules/insights/InputLabel'
import { PolicyCalculation } from '@/src/modules/insights/PolicyCalculation'
import {
  convertFromUnits,
  isGreater,
  isGreaterOrEqual
} from '@/utils/bn'
import { calculateCoverPolicyFee } from '@/utils/calculateCoverPolicyFee'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useWeb3React } from '@web3-react/core'

export const CalculatorCard = () => {
  const { account, library } = useWeb3React()

  const { notifier } = useNotifier()
  const { networkId } = useNetwork()

  const {
    liquidityTokenDecimals,
    liquidityTokenSymbol
  } = useAppConstants()
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)
  const [resultLoading, setResultLoading] = useState(false)

  const router = useRouter()

  const {
    loading,
    covers,
    selected: selectedCover,
    setSelected: setSelectedCover
  } = useCoverDropdown()

  const availableLiquidity = useMemo(() => {
    return convertFromUnits(
      selectedCover?.stats?.availableLiquidity || '0',
      liquidityTokenDecimals
    ).toString()
  }, [selectedCover, liquidityTokenDecimals])

  function handleChange (val) {
    let error = ''

    if (isGreater(val, MAX_PROPOSAL_AMOUNT)) {
      const maxProposalThreshold = formatCurrency(MAX_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      error = t`Maximum proposal threshold is ${
        maxProposalThreshold
      }`
    } else if (isGreater(availableLiquidity, 0) && isGreaterOrEqual(val, availableLiquidity)) {
      const maxProtection = formatCurrency(availableLiquidity, router.locale, liquidityTokenSymbol, true).long
      error = t`Maximum protection available is ${
        maxProtection
      }`
    } else if (isGreater(MIN_PROPOSAL_AMOUNT, val)) {
      const minProposal = formatCurrency(MIN_PROPOSAL_AMOUNT, router.locale, liquidityTokenSymbol, true).long
      error = t`Minimum proposal threshold is ${
        minProposal
      }`
    }

    setAmount(val)
    setError(error)
  }

  const [coverMonth, setCoverMonth] = useState('')

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value)
  }

  const calculatePolicyFee = async () => {
    setResultLoading(true)
    const { data, error } = await calculateCoverPolicyFee({
      networkId,
      value: amount,
      account,
      library,
      coverKey: selectedCover?.coverKey || '',
      productKey: isValidProduct(selectedCover?.productKey) && (selectedCover?.productKey || ''),
      coverMonth,
      liquidityTokenDecimals
    })
    if (error) { setError(getErrorMessage(error)) }

    setResult(data)
    setResultLoading(false)
  }

  const buttonClass = 'block w-full pt-3 pb-3 uppercase px-4 py-0 text-sm font-semibold tracking-wider leading-loose text-white border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-opacity-100 bg-primary'

  const { i18n } = useLingui()

  return (
    <>
      <div className='pb-4 lg:pb-6'>
        <CalculatorCardTitle text='Calculator ' />
      </div>
      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Select a cover' />
        <CoverOptions
          loading={loading}
          covers={covers}
          selected={selectedCover}
          setSelected={setSelectedCover}
        />
      </div>

      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Amount you wish to cover' />
        <CalculatorAmountHandler
          error={error}
          buttonProps={{
            children: t(i18n)`Max`,
            onClick: () => {},
            buttonClassName: 'hidden'
          }}
          unit={liquidityTokenSymbol}
          inputProps={{
            id: 'cover-amount',
            placeholder: t(i18n)`Enter Amount`,
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

      <div className='pb-6 lg:pb-10'>
        {
            account
              ? (
                <button
                  type='button'
                  disabled={!amount || !coverMonth || resultLoading || !selectedCover || Boolean(error)}
                  className={buttonClass}
                  title={t(i18n)`Calculate policy fee`}
                  onClick={calculatePolicyFee}
                >
                  <span className='sr-only'>{t(i18n)`Calculate policy fee`}</span>
                  <Trans>Calculate policy fee</Trans>
                </button>
                )
              : (
                <ConnectWallet networkId={networkId} notifier={notifier}>
                  {({ onOpen }) => {
                    return (
                      <button className={buttonClass} onClick={onOpen}>Connect Wallet</button>
                    )
                  }}
                </ConnectWallet>
                )
          }
      </div>
      <PolicyCalculation
        feeData={result}
        loading={resultLoading}
        selected={selectedCover}
        amount={amount}
      />
    </>
  )
}
