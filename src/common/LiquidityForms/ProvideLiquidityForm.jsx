import {
  useEffect,
  useState
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { BackButton } from '@/common/BackButton/BackButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import {
  useLiquidityFormsContext
} from '@/common/LiquidityForms/LiquidityFormsContext'
import SuccessModal from '@/common/LiquidityForms/SuccessModal'
import {
  ReceiveAmountInput
} from '@/common/ReceiveAmountInput/ReceiveAmountInput'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { TokenAmountWithPrefix } from '@/common/TokenAmountWithPrefix'
import DateLib from '@/lib/date/DateLib'
import {
  MAX_LIQUIDITY,
  MIN_LIQUIDITY
} from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useCalculatePods } from '@/src/hooks/useCalculatePods'
import { useProvideLiquidity } from '@/src/hooks/useProvideLiquidity'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  convertToUnits,
  isEqualTo,
  isGreater,
  toBN
} from '@/utils/bn'
import { fromNow } from '@/utils/formatter/relative-time'
import { getNetworkInfo } from '@/utils/network'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useActiveReportings } from '@/src/hooks/useActiveReportings'

export const ProvideLiquidityForm = ({ coverKey, info, isDiversified, underwrittenProducts }) => {
  const [lqValue, setLqValue] = useState('')
  const [npmValue, setNPMValue] = useState('')
  const router = useRouter()
  const [npmErrorMsg, setNpmErrorMsg] = useState('')
  const [lqErrorMsg, setLqErrorMsg] = useState('')
  const { networkId } = useNetwork()
  const { isMainNet } = getNetworkInfo(networkId)

  const { locale } = useLanguageContext()

  const [isSuccess, setIsSuccess] = useState(false)

  const { i18n } = useLingui()

  const {
    liquidityTokenAddress,
    NPMTokenAddress,
    liquidityTokenSymbol,
    NPMTokenSymbol,
    liquidityTokenDecimals,
    NPMTokenDecimals: npmTokenDecimals
  } = useAppConstants()

  const {
    npmBalance,
    lqApproving,
    npmApproving,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    // canProvideLiquidity,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    isError,
    providing,
    npmBalanceLoading,
    lqAllowanceLoading,
    npmAllowanceLoading
  } = useProvideLiquidity({
    coverKey,
    lqValue,
    npmValue,
    liquidityTokenDecimals,
    npmTokenDecimals,
    underwrittenProducts
  })

  const {
    stablecoinTokenBalance: myStablecoinBalance,
    info: {
      minStakeToAddLiquidity,
      myStake,
      vaultTokenSymbol,
      vault: vaultTokenAddress
    }
  } = useLiquidityFormsContext()

  const { receiveAmount, loading: receiveAmountLoading } = useCalculatePods({
    coverKey,
    value: lqValue,
    podAddress: vaultTokenAddress
  })

  const { data: activeReportings } = useActiveReportings()

  const requiredStake = toBN(minStakeToAddLiquidity).minus(myStake).toString()

  useEffect(() => {
    if (
      npmValue &&
      isGreater(requiredStake, convertToUnits(npmValue, npmTokenDecimals))
    ) {
      setNpmErrorMsg(t(i18n)`Insufficient Stake`)
    } else if (
      npmValue &&
      isGreater(convertToUnits(npmValue, npmTokenDecimals), npmBalance)
    ) {
      setNpmErrorMsg(t(i18n)`Exceeds maximum balance`)
    } else {
      setNpmErrorMsg('')
    }

    if (
      lqValue &&
      isGreater(
        convertToUnits(lqValue, liquidityTokenDecimals),
        myStablecoinBalance
      )
    ) {
      setLqErrorMsg(t(i18n)`Exceeds maximum balance`)
    } else if (
      lqValue &&
      isEqualTo(convertToUnits(lqValue, liquidityTokenDecimals), 0)
    ) {
      setLqErrorMsg(t(i18n)`Please specify an amount`)
    } else if (lqValue && isGreater(MIN_LIQUIDITY, lqValue)) {
      setLqErrorMsg(t(i18n)`Liquidity is below threshold`)
    } else if (lqValue && isGreater(lqValue, MAX_LIQUIDITY)) {
      setLqErrorMsg(t(i18n)`Liquidity is above threshold`)
    } else {
      setLqErrorMsg('')
    }
  }, [
    liquidityTokenDecimals,
    lqValue,
    myStablecoinBalance,
    npmBalance,
    npmTokenDecimals,
    npmValue,
    requiredStake,
    i18n
  ])

  const handleMaxNPM = () => {
    if (!npmBalance) {
      return
    }
    setNPMValue(convertFromUnits(npmBalance, npmTokenDecimals).toString())
  }

  const handleNPMChange = (val) => {
    if (typeof val === 'string') {
      setNPMValue(val)
    }
  }

  const handleMaxLq = () => {
    setLqValue(
      convertFromUnits(myStablecoinBalance, liquidityTokenDecimals).toString()
    )
  }

  const handleLqChange = (val) => {
    if (typeof val === 'string') {
      setLqValue(val)
    }
  }

  const hasBothAllowances = hasLqTokenAllowance && hasNPMTokenAllowance

  // @todo: Instead we could expose `isCoverNormalInternal` from smart contracts
  const currentCoverActiveIncidents = activeReportings.incidentReports.filter(x => { return x.coverKey === coverKey })
  if (currentCoverActiveIncidents.length > 0) {
    const status = 'Reporting' // @todo: Update status to be dynamic from API or smart contracts
    const incidentDate = currentCoverActiveIncidents[0].incidentDate
    const productKey = currentCoverActiveIncidents[0].productKey

    const statusLink = (
      <Link
        href={Routes.ViewReport(coverKey, productKey, incidentDate, networkId)}
        className='font-medium underline hover:no-underline'
      >
        {status}
      </Link>
    )

    return isDiversified
      ? (
        <Alert>
          <Trans>
            Cannot add liquidity, as one of the product&apos;s status is not
            normal
          </Trans>
        </Alert>
        )
      : (
        <Alert>
          <Trans>
            Cannot add liquidity, since the cover status is {statusLink}
          </Trans>
        </Alert>
        )
  }

  let loadingMessage = ''
  if (receiveAmountLoading) {
    loadingMessage = t(i18n)`Calculating tokens...`
  } else if (npmBalanceLoading) {
    loadingMessage = t(i18n)`Fetching balance...`
  } else if (npmAllowanceLoading) {
    loadingMessage = t(i18n)`Fetching ${NPMTokenSymbol} allowance...`
  } else if (lqAllowanceLoading) {
    loadingMessage = t(i18n)`Fetching ${liquidityTokenSymbol} allowance...`
  }

  const isInvalidNpm = toBN(requiredStake).isGreaterThan(0) ? !npmValue : false

  const isStakeDisabled = isEqualTo(minStakeToAddLiquidity, 0) && isMainNet

  return (
    <div className='max-w-md' data-testid='add-liquidity-form'>
      {!isStakeDisabled && (
        <div className='mb-16'>
          <TokenAmountInput
            labelText={<Trans>Enter your {NPMTokenSymbol} stake</Trans>}
            onChange={handleNPMChange}
            handleChooseMax={handleMaxNPM}
            error={Boolean(npmErrorMsg)}
            tokenAddress={NPMTokenAddress}
            tokenSymbol={NPMTokenSymbol}
            tokenBalance={npmBalance || '0'}
            tokenDecimals={npmTokenDecimals}
            inputId='npm-stake'
            inputValue={npmValue}
            disabled={lqApproving || providing}
          >
            {isGreater(minStakeToAddLiquidity, myStake) && (
              <TokenAmountWithPrefix
                amountInUnits={minStakeToAddLiquidity}
                prefix={<><Trans>Minimum Stake:</Trans>{' '}</>}
                symbol={NPMTokenSymbol}
                decimals={npmTokenDecimals}
              />
            )}
            {isGreater(myStake, '0') && (
              <TokenAmountWithPrefix
                amountInUnits={myStake}
                prefix={<><Trans>Your Stake:</Trans>{' '}</>}
                symbol={NPMTokenSymbol}
                decimals={npmTokenDecimals}
              />
            )}

            {npmErrorMsg && (
              <p className='flex items-center text-FA5C2F'>{npmErrorMsg}</p>
            )}
          </TokenAmountInput>
        </div>
      )}

      <div className='mb-16'>
        <TokenAmountInput
          labelText={<Trans>Enter Amount you wish to provide</Trans>}
          onChange={handleLqChange}
          handleChooseMax={handleMaxLq}
          error={isError}
          tokenAddress={liquidityTokenAddress}
          tokenSymbol={liquidityTokenSymbol}
          tokenDecimals={liquidityTokenDecimals}
          tokenBalance={myStablecoinBalance || '0'}
          inputId='stablecoin-amount'
          inputValue={lqValue}
          disabled={lqApproving || providing}
        >
          {lqErrorMsg && (
            <p className='flex items-center text-FA5C2F'>{lqErrorMsg}</p>
          )}
        </TokenAmountInput>
      </div>

      <div className='mb-16'>
        <ReceiveAmountInput
          labelText={<Trans>You will receive</Trans>}
          tokenSymbol={vaultTokenSymbol}
          inputValue={receiveAmount}
        />
      </div>

      <h5 className='block mb-3 font-semibold text-black uppercase text-md'>
        <Trans>NEXT UNLOCK CYCLE</Trans>
      </h5>
      <div>
        <span className='text-7398C0' title={fromNow(info.withdrawalOpen, locale)}>
          <strong>
            <Trans comment='Liquidity Withdrawal Period Open Date'>Open:</Trans>{' '}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalOpen, locale)}
        </span>
      </div>
      <div>
        <span className='text-7398C0' title={fromNow(info.withdrawalClose, locale)}>
          <strong>
            <Trans comment='Liquidity Withdrawal Period Closing Date'>
              Close:
            </Trans>{' '}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalClose, locale)}
        </span>
      </div>

      <div className='mt-2'>
        <DataLoadingIndicator message={loadingMessage} />
        {!hasBothAllowances && (
          <div className='flex flex-col items-center sm:flex-row gap-x-10'>
            <RegularButton
              disabled={Boolean(
                hasLqTokenAllowance ||
                lqApproving ||
                lqErrorMsg ||
                loadingMessage
              )}
              className='w-full p-6 mb-4 font-semibold uppercase sm:mb-0'
              onClick={() => {
                handleLqTokenApprove()
              }}
            >
              {lqApproving
                ? (
                  <Trans>Approving...</Trans>
                  )
                : (
                  <>
                    <Trans>Approve</Trans> {liquidityTokenSymbol || <Trans>Liquidity</Trans>}
                  </>
                  )}
            </RegularButton>

            {!isStakeDisabled && (
              <RegularButton
                disabled={Boolean(
                  hasNPMTokenAllowance ||
                  npmApproving ||
                  npmErrorMsg ||
                  loadingMessage
                )}
                className='w-full p-6 font-semibold uppercase'
                onClick={() => {
                  handleNPMTokenApprove()
                }}
              >
                {npmApproving
                  ? (
                    <Trans>Approving...</Trans>
                    )
                  : (
                    <>
                      {NPMTokenSymbol ? <Trans>Approve {NPMTokenSymbol}</Trans> : <Trans>Approve Stake</Trans>}
                    </>
                    )}
              </RegularButton>
            )}
          </div>
        )}

        {hasBothAllowances && (
          <RegularButton
            disabled={Boolean(
              isError ||
              providing ||
              !lqValue ||
              isInvalidNpm ||
              npmErrorMsg ||
              lqErrorMsg ||
              loadingMessage
            )}
            className='w-full p-6 font-semibold uppercase'
            onClick={() => {
              handleProvide(() => {
                setIsSuccess(true)
                setNPMValue('')
                setLqValue('')
              })
            }}
          >
            {providing
              ? (
                <Trans>Providing Liquidity...</Trans>
                )
              : (
                <>
                  <Trans>Provide Liquidity</Trans>
                </>
                )}
          </RegularButton>
        )}
      </div>

      <div className='flex justify-center mt-12 md:justify-start'>
        <BackButton onClick={() => { return router.back() }} />
      </div>

      <SuccessModal
        open={isSuccess}
        close={() => { return setIsSuccess(false) }}
        amountInDollars={Number(lqValue || '0')}
      />
    </div>
  )
}
