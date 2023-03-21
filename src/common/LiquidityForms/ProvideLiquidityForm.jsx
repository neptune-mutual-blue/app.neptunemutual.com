import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { Alert } from '@/common/Alert/Alert'
import { BackButton } from '@/common/BackButton/BackButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { useLiquidityFormsContext } from '@/common/LiquidityForms/LiquidityFormsContext'
import { ReceiveAmountInput } from '@/common/ReceiveAmountInput/ReceiveAmountInput'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { TokenAmountWithPrefix } from '@/common/TokenAmountWithPrefix'
import DateLib from '@/lib/date/DateLib'
import { MAX_LIQUIDITY, MIN_LIQUIDITY } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useCalculatePods } from '@/src/hooks/useCalculatePods'
import { useCoverActiveReportings } from '@/src/hooks/useCoverActiveReportings'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useProvideLiquidity } from '@/src/hooks/useProvideLiquidity'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { log } from '@/src/services/logs'
import {
  convertFromUnits, convertToUnits,
  isEqualTo, isGreater, toBN
} from '@/utils/bn'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { fromNow } from '@/utils/formatter/relative-time'
import { analyticsLogger } from '@/utils/logger'
import { t, Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Link from 'next/link'

export const ProvideLiquidityForm = ({ coverKey, info, isDiversified, underwrittenProducts }) => {
  const [lqValue, setLqValue] = useState('')
  const [npmValue, setNPMValue] = useState('')
  const router = useRouter()
  const [npmErrorMsg, setNpmErrorMsg] = useState('')
  const [lqErrorMsg, setLqErrorMsg] = useState('')
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

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
    info: {
      minStakeToAddLiquidity,
      myStake,
      myStablecoinBalance,
      vaultTokenSymbol,
      vault: vaultTokenAddress
    }
  } = useLiquidityFormsContext()

  const { receiveAmount, loading: receiveAmountLoading } = useCalculatePods({
    coverKey,
    value: lqValue,
    podAddress: vaultTokenAddress
  })

  const { data: activeReportings } = useCoverActiveReportings({ coverKey })

  const requiredStake = toBN(minStakeToAddLiquidity).minus(myStake).toString()

  useEffect(() => {
    if (
      npmValue &&
      isGreater(requiredStake, convertToUnits(npmValue, npmTokenDecimals))
    ) {
      setNpmErrorMsg(t`Insufficient Stake`)
    } else if (
      npmValue &&
      isGreater(convertToUnits(npmValue, npmTokenDecimals), npmBalance)
    ) {
      setNpmErrorMsg(t`Exceeds maximum balance`)
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
      setLqErrorMsg(t`Exceeds maximum balance`)
    } else if (
      lqValue &&
      isEqualTo(convertToUnits(lqValue, liquidityTokenDecimals), 0)
    ) {
      setLqErrorMsg(t`Please specify an amount`)
    } else if (lqValue && isGreater(MIN_LIQUIDITY, lqValue)) {
      setLqErrorMsg(t`Liquidity is below threshold`)
    } else if (lqValue && isGreater(lqValue, MAX_LIQUIDITY)) {
      setLqErrorMsg(t`Liquidity is above threshold`)
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
    requiredStake
  ])

  const approvalSequence = useRef(0)

  const productKey = safeFormatBytes32String('')
  const { coverInfo } = useCoverOrProductData({ coverKey, productKey })
  const { chainId, account } = useWeb3React()

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

  if (activeReportings.length > 0) {
    const status = activeReportings[0].status
    const incidentDate = activeReportings[0].incidentDate
    const productKey = activeReportings[0].productKey

    const statusLink = (
      <Link href={Routes.ViewReport(coverKey, productKey, incidentDate)}>
        <a className='font-medium underline hover:no-underline'>{status}</a>
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
    loadingMessage = t`Calculating tokens...`
  } else if (npmBalanceLoading) {
    loadingMessage = t`Fetching balance...`
  } else if (npmAllowanceLoading) {
    loadingMessage = t`Fetching ${NPMTokenSymbol} allowance...`
  } else if (lqAllowanceLoading) {
    loadingMessage = t`Fetching ${liquidityTokenSymbol} allowance...`
  }

  const isInvalidNpm = toBN(requiredStake).isGreaterThan(0) ? !npmValue : false

  const handleApprovalLog = (symbol, amount) => {
    const funnel = 'Adding Liquidity'
    const journey = `my-${router?.query?.coverId}-liquidity-page`

    const sequence = approvalSequence.current + 1

    const step = `approve-${symbol}-button`
    const event = 'click'
    const props = {
      token: symbol,
      approveAmount: amount
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, props)
    })

    approvalSequence.current += 1
  }

  const handleLog = () => {
    const funnel = 'Adding Liquidity'
    const journey = `my-${router?.query?.coverId}-liquidity-page`

    const sequence1 = 3
    const step1 = 'provide-liquidity-button'
    const event1 = 'click'
    const props1 = {
      coverKey,
      coverName: coverInfo?.infoObj?.coverName
    }

    const sequence2 = 9999
    const step2 = 'end'
    const event2 = 'closed'

    analyticsLogger(() => {
      log(chainId, funnel, journey, step1, sequence1, account, event1, props1)
      log(chainId, funnel, journey, step2, sequence2, account, event2, {})
    })
  }

  const isStakeDisabled = isEqualTo(minStakeToAddLiquidity, 0) && isMainNet

  return (
    <div className='max-w-md' data-testid='add-liquidity-form'>
      {!isStakeDisabled && (
        <div className='mb-16'>
          <TokenAmountInput
            labelText={t`Enter your ${NPMTokenSymbol} stake`}
            onChange={handleNPMChange}
            handleChooseMax={handleMaxNPM}
            error={npmErrorMsg}
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
                prefix={t`Minimum Stake:` + ' '}
                symbol={NPMTokenSymbol}
                decimals={npmTokenDecimals}
              />
            )}
            {isGreater(myStake, '0') && (
              <TokenAmountWithPrefix
                amountInUnits={myStake}
                prefix={`${t`Your Stake`}: `}
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
          labelText={t`Enter Amount you wish to provide`}
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
          labelText={t`You will receive`}
          tokenSymbol={vaultTokenSymbol}
          inputValue={receiveAmount}
        />
      </div>

      <h5 className='block mb-3 font-semibold text-black uppercase text-md'>
        <Trans>NEXT UNLOCK CYCLE</Trans>
      </h5>
      <div>
        <span className='text-7398C0' title={fromNow(info.withdrawalOpen)}>
          <strong>
            <Trans comment='Liquidity Withdrawal Period Open Date'>Open:</Trans>{' '}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalOpen, router.locale)}
        </span>
      </div>
      <div>
        <span className='text-7398C0' title={fromNow(info.withdrawalClose)}>
          <strong>
            <Trans comment='Liquidity Withdrawal Period Closing Date'>
              Close:
            </Trans>{' '}
          </strong>
          {DateLib.toLongDateFormat(info.withdrawalClose, router.locale)}
        </span>
      </div>

      <div className='mt-2'>
        <DataLoadingIndicator message={loadingMessage} />
        {!hasBothAllowances && (
          <div className='flex flex-col items-center sm:flex-row gap-x-10'>
            <RegularButton
              disabled={
                hasLqTokenAllowance ||
                lqApproving ||
                lqErrorMsg ||
                loadingMessage
              }
              className='w-full p-6 mb-4 font-semibold uppercase sm:mb-0'
              onClick={() => {
                handleApprovalLog(liquidityTokenSymbol, lqValue)
                handleLqTokenApprove()
              }}
            >
              {lqApproving
                ? (
                    t`Approving...`
                  )
                : (
                  <>
                    <Trans>Approve</Trans> {liquidityTokenSymbol || t`Liquidity`}
                  </>
                  )}
            </RegularButton>

            {!isStakeDisabled && (
              <RegularButton
                disabled={
                hasNPMTokenAllowance ||
                npmApproving ||
                npmErrorMsg ||
                loadingMessage
              }
                className='w-full p-6 font-semibold uppercase'
                onClick={() => {
                  handleApprovalLog(NPMTokenSymbol, npmValue)
                  handleNPMTokenApprove()
                }}
              >
                {npmApproving
                  ? (
                      t`Approving...`
                    )
                  : (
                    <>
                      <Trans>Approve</Trans> {NPMTokenSymbol || t`Stake`}
                    </>
                    )}
              </RegularButton>
            )}
          </div>
        )}

        {hasBothAllowances && (
          <RegularButton
            disabled={
              isError ||
              providing ||
              !lqValue ||
              isInvalidNpm ||
              npmErrorMsg ||
              lqErrorMsg ||
              loadingMessage
            }
            className='w-full p-6 font-semibold uppercase'
            onClick={() => {
              handleLog()

              handleProvide(() => {
                setNPMValue('')
                setLqValue('')
              })
            }}
          >
            {providing
              ? (
                  t`Providing Liquidity...`
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
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  )
}
