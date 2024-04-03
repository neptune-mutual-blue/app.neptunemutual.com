import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import {
  useLiquidityFormsContext
} from '@/common/LiquidityForms/LiquidityFormsContext'
import {
  ReceiveAmountInput
} from '@/common/ReceiveAmountInput/ReceiveAmountInput'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { TokenAmountWithPrefix } from '@/common/TokenAmountWithPrefix'
import DateLib from '@/lib/date/DateLib'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useCalculateLiquidity } from '@/src/hooks/useCalculateLiquidity'
import { useRemoveLiquidity } from '@/src/hooks/useRemoveLiquidity'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  convertToUnits,
  isEqualTo,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  toBN
} from '@/utils/bn'
import { formatAmount } from '@/utils/formatter'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { fromNow } from '@/utils/formatter/relative-time'
import { getNetworkInfo } from '@/utils/network'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const WithdrawLiquidityForm = ({ setModalDisabled }) => {
  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const [podValue, setPodValue] = useState('')
  const [npmValue, setNpmValue] = useState('')
  const [npmErrorMsg, setNpmErrorMsg] = useState('')
  const [podErrorMsg, setPodErrorMsg] = useState('')
  const [isExit, setIsExit] = useState(false)
  const { networkId } = useNetwork()
  const { isMainNet } = getNetworkInfo(networkId)

  const { locale } = useLanguageContext()

  const {
    NPMTokenAddress,
    liquidityTokenSymbol,
    NPMTokenSymbol,
    NPMTokenDecimals,
    liquidityTokenDecimals
  } = useAppConstants()
  const { receiveAmount, loading: receiveAmountLoading } =
    useCalculateLiquidity({
      coverKey,
      podAmount: podValue || '0'
    })
  const {
    info: {
      myStake,
      minStakeToAddLiquidity,
      isAccrualComplete,
      withdrawalOpen,
      withdrawalClose,
      vaultTokenDecimals,
      vault: vaultTokenAddress,
      vaultTokenSymbol,
      myPodBalance: balance
    }
  } = useLiquidityFormsContext()
  const {
    allowance,
    approving,
    withdrawing,
    loadingAllowance,
    handleApprove,
    handleWithdraw
  } = useRemoveLiquidity({
    coverKey,
    value: podValue || '0',
    npmValue: npmValue || '0'
  })

  const { i18n } = useLingui()

  const unStakableAmount = toBN(myStake)
    .minus(minStakeToAddLiquidity)
    .toString()

  // Clear on modal close
  useEffect(() => {
    return () => {
      setPodValue('')
      setNpmValue('')
    }
  }, [])

  useEffect(() => {
    setModalDisabled(withdrawing)
  }, [setModalDisabled, withdrawing])

  useEffect(() => {
    if (
      !isExit &&
      npmValue &&
      isGreater(convertToUnits(npmValue), unStakableAmount)
    ) {
      setNpmErrorMsg(t(i18n)`Cannot go below minimum stake`)
    } else {
      setNpmErrorMsg('')
    }

    if (podValue && isGreater(convertToUnits(podValue), balance)) {
      setPodErrorMsg(t(i18n)`Exceeds maximum balance`)
    } else if (podValue && isEqualTo(convertToUnits(podValue), 0)) {
      setPodErrorMsg(t(i18n)`Insufficient Balance`)
    } else {
      setPodErrorMsg('')
    }
  }, [balance, npmValue, podValue, unStakableAmount, isExit, i18n])

  const handleChooseNpmMax = () => {
    setNpmValue(convertFromUnits(unStakableAmount).toString())
  }

  const handleChoosePodMax = () => {
    setPodValue(convertFromUnits(balance).toString())
  }

  const handleNpmChange = (val) => {
    if (typeof val === 'string') {
      setNpmValue(val)
    }
  }

  const handlePodChange = (val) => {
    if (typeof val === 'string') {
      setPodValue(val)
    }
  }

  const canWithdraw =
    podValue &&
    isValidNumber(podValue) &&
    isGreaterOrEqual(allowance, convertToUnits(podValue || '0'))

  let loadingMessage = ''
  if (receiveAmountLoading) {
    loadingMessage = t(i18n)`Calculating tokens...`
  } else if (loadingAllowance) {
    loadingMessage = t(i18n)`Fetching allowance...`
  }

  const handleExit = (ev) => {
    setIsExit(ev.target.checked)
    if (ev.target.checked) {
      setNpmValue(convertFromUnits(myStake).toString())
      setPodValue(convertFromUnits(balance).toString())
    }
  }

  const isStakeDisabled = isEqualTo(minStakeToAddLiquidity, 0) && isMainNet

  return (
    <>
      <div
        className='overflow-y-auto max-h-[50vh] px-8 sm:px-12'
        data-testid='withdraw-liquidity-form-inputs'
      >
        {!isStakeDisabled && (
          <div className='flex flex-col mt-6'>
            <TokenAmountInput
              labelText={<Trans>Enter {NPMTokenSymbol} Amount</Trans>}
              disabled={isExit}
              handleChooseMax={handleChooseNpmMax}
              inputValue={npmValue}
              id='my-staked-amount'
              onChange={handleNpmChange}
              tokenAddress={NPMTokenAddress}
              tokenSymbol={NPMTokenSymbol}
              tokenDecimals={NPMTokenDecimals}
              data-testid='npm-input'
            >
              {isGreater(myStake, '0') && (
                <TokenAmountWithPrefix
                  amountInUnits={myStake}
                  prefix={`${t(i18n)`Your Stake`}: `}
                  symbol={NPMTokenSymbol}
                  decimals={NPMTokenDecimals}
                  data-testid='my-stake-prefix'
                />
              )}
              <TokenAmountWithPrefix
                amountInUnits={minStakeToAddLiquidity}
                prefix={t(i18n)`Minimum Stake:` + ' '}
                symbol={NPMTokenSymbol}
                decimals={NPMTokenDecimals}
                data-testid='minimum-stake-prefix'
              />
            </TokenAmountInput>
            {!isExit && npmErrorMsg && (
              <p className='text-FA5C2F' data-testid='npm-error'>
                {npmErrorMsg}
              </p>
            )}
          </div>
        )}

        <div className='mt-6'>
          <TokenAmountInput
            labelText={<Trans>Enter your POD</Trans>}
            disabled={isExit}
            handleChooseMax={handleChoosePodMax}
            inputValue={podValue}
            id='my-liquidity-amount'
            onChange={handlePodChange}
            tokenBalance={balance}
            tokenSymbol={vaultTokenSymbol}
            tokenAddress={vaultTokenAddress}
            tokenDecimals={vaultTokenDecimals}
            data-testid='pod-input'
          />
          {podErrorMsg && (
            <p className='text-FA5C2F' data-testid='pod-error'>
              {podErrorMsg}
            </p>
          )}
        </div>

        <div className='mt-6 modal-unlock'>
          <ReceiveAmountInput
            labelText={<Trans>You will receive</Trans>}
            tokenSymbol={liquidityTokenSymbol}
            inputValue={formatAmount(
              convertFromUnits(
                receiveAmount,
                liquidityTokenDecimals
              ).toString(),
              locale
            )}
            data-testid='receive-input'
          />
        </div>

        <h5 className='block mt-6 mb-1 font-semibold text-black uppercase text-md'>
          <Trans>NEXT UNLOCK CYCLE</Trans>
        </h5>

        <div>
          <span
            className='text-7398C0'
            title={fromNow(withdrawalOpen, locale)}
            data-testid='open-date'
          >
            <strong>
              <Trans comment='Liquidity Withdrawal Period Open Date'>
                Open:
              </Trans>{' '}
            </strong>
            {DateLib.toLongDateFormat(withdrawalOpen, locale)}
          </span>
        </div>

        <div>
          <span
            className='text-7398C0'
            title={fromNow(withdrawalClose, locale)}
            data-testid='close-date'
          >
            <strong>
              <Trans comment='Liquidity Withdrawal Period Closing Date'>
                Close:
              </Trans>{' '}
            </strong>
            {DateLib.toLongDateFormat(withdrawalClose, locale)}
          </span>
        </div>

        <div className='flex items-center mt-8'>
          <Checkbox
            id='exitCheckBox'
            name='checkexitliquidity'
            checked={isExit}
            onChange={(ev) => { return handleExit(ev) }}
            data-testid='exit-checkbox'
          >
            Withdraw Full Liquidity
          </Checkbox>
        </div>
      </div>

      <div
        className='px-8 mt-4 sm:px-12'
        data-testid='withdraw-liquidity-form-buttons'
      >
        {!isAccrualComplete && <p className='text-FA5C2F'>Wait for accrual</p>}
        <DataLoadingIndicator message={loadingMessage} />
        {!canWithdraw
          ? (
            <RegularButton
              onClick={() => {
                handleApprove()
              }}
              className='w-full p-6 font-semibold uppercase'
              disabled={
              approving ||
              !!npmErrorMsg ||
              !!podErrorMsg ||
              receiveAmountLoading ||
              !podValue ||
              loadingAllowance ||
              !isAccrualComplete
            }
              data-testid='approve-button'
            >
              {approving ? t(i18n)`Approving...` : t`Approve`}
            </RegularButton>
            )
          : (
            <RegularButton
              onClick={() => {
                handleWithdraw(() => {
                  setPodValue('')
                  setNpmValue('')
                }, isExit)
              }}
              className='w-full p-6 font-semibold uppercase'
              disabled={
              withdrawing ||
              !!npmErrorMsg ||
              !!podErrorMsg ||
              receiveAmountLoading ||
              !podValue ||
              loadingAllowance ||
              !isAccrualComplete
            }
              data-testid='withdraw-button'
            >
              {withdrawing ? t(i18n)`Withdrawing...` : t`Withdraw`}
            </RegularButton>
            )}
      </div>
    </>
  )
}
