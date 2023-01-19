import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { BackButton } from '@/common/BackButton/BackButton'
import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { PurchasePolicyModal } from '@/common/CoverForm/PurchasePolicyModal'
import CoveragePeriodStep from '@/common/CoverForm/Steps/CoveragePeriodStep'
import PurchaseAmountStep from '@/common/CoverForm/Steps/PurchaseAmountStep'
import PurchasePolicyStep from '@/common/CoverForm/Steps/PurchasePolicyStep'
import QuotationStep from '@/common/CoverForm/Steps/QuotationStep'
import { RegularInput } from '@/common/Input/RegularInput'
import { Label } from '@/common/Label/Label'
import { Loader } from '@/common/Loader/Loader'
import StepsIndicator from '@/common/StepsIndicator'
import LeftArrow from '@/icons/LeftArrow'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import { getMonthNames } from '@/lib/dates'
import ErrorIcon from '@/lib/toast/components/icons/ErrorIcon'
import SuccessIcon from '@/lib/toast/components/icons/SuccessIcon'
import {
  MAX_PROPOSAL_AMOUNT,
  MIN_PROPOSAL_AMOUNT
} from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useNotifier } from '@/src/hooks/useNotifier'
import { usePolicyFees } from '@/src/hooks/usePolicyFees'
import { usePurchasePolicy } from '@/src/hooks/usePurchasePolicy'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { useValidateReferralCode } from '@/src/hooks/useValidateReferralCode'
import { log } from '@/src/services/logs'
import {
  convertFromUnits,
  isGreater
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { analyticsLogger } from '@/utils/logger'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

const getCoveragePeriodLabels = (locale) => {
  const now = new Date()
  const day = now.getUTCDate()
  const currentMonthIndex = now.getUTCMonth()

  const monthNames = getMonthNames(locale)

  // Note: Refer `getExpiryDateInternal` in protocol
  // https://github.com/neptune-mutual-blue/protocol/blob/a98fcce3657d80814f2aca67a4a8a3534ff8da2d/contracts/libraries/CoverUtilV1.sol#L599-L613
  if (day >= 25) {
    return [
      monthNames[(currentMonthIndex + 1 + 0) % 12],
      monthNames[(currentMonthIndex + 1 + 1) % 12],
      monthNames[(currentMonthIndex + 1 + 2) % 12]
    ]
  }

  return [
    monthNames[(currentMonthIndex + 0) % 12],
    monthNames[(currentMonthIndex + 1) % 12],
    monthNames[(currentMonthIndex + 2) % 12]
  ]
}

export const PurchasePolicyForm = ({ coverKey, productKey, coverInfo }) => {
  const router = useRouter()
  const { notifier } = useNotifier()
  const { networkId } = useNetwork()
  const { isMainNet, isArbitrum } = useValidateNetwork(networkId)

  const [formSteps, setFormSteps] = useState(0)
  const [showReferral, setShowReferral] = useState(false)
  const [value, setValue] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [isReferralCodeCheckPending, setIsReferralCodeCheckPending] = useState(false)
  const [coverMonth, setCoverMonth] = useState('')
  const [rulesAccepted, setRulesAccepted] = useState(false)

  const {
    liquidityTokenDecimals,
    liquidityTokenSymbol
  } = useAppConstants()
  const { availableLiquidity: availableLiquidityInWei, coverageLag } = useCoverStatsContext()
  const availableLiquidity = convertFromUnits(
    availableLiquidityInWei,
    liquidityTokenDecimals
  ).toString()

  const {
    isValid: isValidReferralCode,
    errorMessage: referralCodeErrorMessage
  } = useValidateReferralCode(referralCode, setIsReferralCodeCheckPending)

  const { loading: updatingFee, data: feeData } = usePolicyFees({
    value,
    liquidityTokenDecimals,
    coverMonth,
    coverKey,
    productKey
  })

  const {
    txHash,
    purchaseWaiting,
    approving,
    purchasing,
    canPurchase,
    error,
    handleApprove,
    handlePurchase,
    updatingBalance,
    updatingAllowance
  } = usePurchasePolicy({
    value,
    coverMonth,
    coverKey,
    productKey,
    feeAmount: feeData.fee,
    availableLiquidity,
    liquidityTokenSymbol,
    referralCode: referralCode.trim()
  })

  const {
    isUserWhitelisted,
    requiresWhitelist,
    activeIncidentDate,
    productStatus
  } = useCoverStatsContext()

  const { account, chainId } = useWeb3React()

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setValue(val)
    }
  }

  const handleRadioChange = (e) => {
    setShowReferral(true)
    setCoverMonth(e.target.value)
  }

  function referralCodeChange (e) {
    setIsReferralCodeCheckPending(true)
    setReferralCode(e.target.value)
  }

  const coverPeriodLabels = getCoveragePeriodLabels(router.locale)

  const handleLog = (sequence) => {
    const funnel = 'Purchase Policy'
    const journey = 'purchase-policy-page'

    let step, event
    switch (sequence) {
      case 1:
        step = 'approve-button'
        event = 'click'
        break

      case 2:
        step = 'purchase-policy-button'
        event = 'click'
        break

      case 9999:
        step = 'end'
        event = 'closed'
        break

      default:
        step = 'step'
        event = 'event'
        break
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, {})
    })
  }

  let canProceed = true
  if (formSteps === 0) {
    const invalidAmount = !value || isGreater(value, availableLiquidity) ||
    isGreater(value, MAX_PROPOSAL_AMOUNT) ||
    isGreater(MIN_PROPOSAL_AMOUNT, value)

    canProceed = account && !invalidAmount
  } else if (formSteps === 1) {
    canProceed = !!coverMonth
  } else if (formSteps === 2) {
    canProceed = rulesAccepted
  }

  let loadingMessage = ''
  if (updatingFee) {
    loadingMessage = t`Fetching fees...`
  } else if (updatingAllowance) {
    loadingMessage = t`Fetching allowance...`
  } else if (updatingBalance) {
    loadingMessage = t`Fetching balance...`
  }

  if (requiresWhitelist && !isUserWhitelisted) {
    return (
      <Alert>
        <Trans>You are not whitelisted</Trans>
      </Alert>
    )
  }

  if (productStatus && productStatus !== 'Normal') {
    const statusLink = (
      <Link href={Routes.ViewReport(coverKey, productKey, activeIncidentDate)}>
        <a className='font-medium underline hover:no-underline'>
          {productStatus}
        </a>
      </Link>
    )
    return (
      <Alert>
        <Trans>
          Cannot purchase policy, since the cover status is {statusLink}
        </Trans>
      </Alert>
    )
  }

  const hasReferralCode = !!referralCode.trim().length
  const isDiversified = isValidProduct(productKey)

  const coverName = safeParseBytes32String(coverKey)
  const productName = safeParseBytes32String(productKey)
  const coverImgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  const buttonBg = isArbitrum
    ? 'bg-1D9AEE'
    : isMainNet
      ? 'bg-4e7dd9'
      : 'bg-5D52DC'

  return (
    <div className='flex flex-col w-616'>
      {formSteps === 0 && value && <StepsIndicator completed='50' />}
      {formSteps === 1 && <StepsIndicator completed={value && coverMonth ? '100' : '50'} />}
      <div className='w-full p-4 rounded-xl bg-FEFEFF md:p-9 border-B0C4DB border-1.5' data-testid='purchase-policy-form'>
        <h4 className='flex items-center justify-center pb-6 text-sm font-bold text-center capitalize font-sora'>
          <div className='w-8 h-8 p-1 mr-2.5 rounded-full bg-DEEAF6'>
            <img
              src={coverImgSrc} alt=''
            />
          </div>
          <span>{productName || coverName} Price Quotation</span>
        </h4>
        <p className='h-px mb-6 bg-left-top bg-repeat-x bg-dashed-border bg-dashed-size' />

        {formSteps === 0 && (
          <PurchaseAmountStep
            approving={approving}
            setValue={setValue}
            liquidityTokenDecimals={liquidityTokenDecimals}
            liquidityTokenSymbol={liquidityTokenSymbol}
            purchasing={purchasing}
            value={value}
            availableLiquidity={availableLiquidity}
            coverInfo={coverInfo}
          />)}
        {formSteps === 1 && (
          <CoveragePeriodStep
            value={value}
            approving={approving}
            coverMonth={coverMonth}
            coverPeriodLabels={coverPeriodLabels}
            handleRadioChange={handleRadioChange}
            purchasing={purchasing}
            tokenSymbol={liquidityTokenSymbol}
            feeData={feeData}
          />)}

        {formSteps === 2 && (
          <>
            <QuotationStep
              feeData={feeData}
              value={value}
              coverMonth={coverMonth}
              coverageLag={coverageLag}
              liquidityTokenDecimals={liquidityTokenDecimals}
              liquidityTokenSymbol={liquidityTokenSymbol}
              referralCode={referralCode}
            />

            <Checkbox
              name='terms_parameters_exclusions'
              id='terms_parameters_exclusions'
              onChange={() => { setRulesAccepted(!rulesAccepted) }}
            >
              <Trans>
                I have read, understood, and agree to the cover terms, parameters, and exclusions, as well as the standard exclusions.
              </Trans>
            </Checkbox>

          </>
        )}

        {formSteps === 3 && (
          <PurchasePolicyStep
            coverName={productName || coverName}
            feeData={feeData}
            value={value}
            approving={approving}
            canPurchase={canPurchase}
            coverMonth={coverMonth}
            coverageLag={coverageLag}
            error={error}
            handleApprove={handleApprove}
            handleLog={handleLog}
            handlePurchase={handlePurchase}
            isReferralCodeCheckPending={isReferralCodeCheckPending}
            referralCodeChange={referralCodeChange}
            isValidReferralCode={isValidReferralCode}
            loadingMessage={loadingMessage}
            purchasing={purchasing}
            setCoverMonth={setCoverMonth}
            setReferralCode={setReferralCode}
            setValue={setValue}
            updatingBalance={updatingBalance}
            updatingFee={updatingFee}
            referralCode={referralCode}
            handleChange={handleChange}
            coverPeriodLabels={coverPeriodLabels}
            handleRadioChange={handleRadioChange}
            referralCodeErrorMessage={referralCodeErrorMessage}
            hasReferralCode={hasReferralCode}
          />
        )}

        {showReferral && formSteps === 1 && (
          <div className='mt-14'>
            <Label htmlFor='incident_title' className='mb-2 text-center'>
              <Trans>Enter Cashback Code</Trans>
            </Label>

            <div className='relative'>
              <RegularInput
                className='leading-none disabled:cursor-not-allowed !text-h5 !pr-14 focus-visible:ring-0 text-center'
                error={!!referralCodeErrorMessage}
                id='referral_code'
                placeholder={t`Enter Cashback Code`}
                value={referralCode}
                onChange={referralCodeChange}
                disabled={approving}
                type='text'
                data-testid='referral-input'
              />

              {hasReferralCode
                ? (
                  <ReferralCodeStatus
                    isReferralCodeCheckPending={isReferralCodeCheckPending}
                    isValidReferralCode={isValidReferralCode}
                  />
                  )
                : null}
            </div>
          </div>
        )}

        {!account && (
          <Alert info>
            <div className='flex flex-wrap items-end justify-between ml-4'>
              <div className='max-w-[265px] mb-4 md:mb-0'>
                <h5 className='font-semibold text-h5'>Wallet Not Connected.</h5>
                <p>Please connect your wallet to view the price quotation.</p>
              </div>
              <ConnectWallet networkId={networkId} notifier={notifier}>
                {({ onOpen }) => {
                  return (
                    <RegularButton className='px-2 text-xs h-fit' onClick={onOpen}>Connect Wallet</RegularButton>
                  )
                }}
              </ConnectWallet>
            </div>
          </Alert>
        )}

        {formSteps < 3 && (
          <div className='flex flex-wrap justify-end mt-12 xs:flex-row-reverse sm:justify-start'>
            <button
              disabled={!canProceed}
              className={classNames(
                formSteps >= 0 ? 'hover:bg-opacity-80' : 'opacity-50 cursor-not-allowed',
                buttonBg,
                'disabled:cursor-not-allowed disabled:opacity-50',
                'flex items-center text-EEEEEE py-3 px-4 rounded-big w-full sm:w-auto justify-center uppercase tracking-wide ml-4 mt-2 md:mt-0'
              )}
              onClick={() => {
                if (formSteps === 1) {
                  !isValidReferralCode && setReferralCode('')
                }
                setFormSteps((prev) => prev + 1)
              }}
            >
              {formSteps === 0 && (
                <>
                  <Trans>Next</Trans>
                  <LeftArrow variant='right' />
                </>
              )}
              {formSteps === 1 && <Trans>View Quotation</Trans>}
              {formSteps === 2 && <Trans>Purchase Policy</Trans>}
            </button>

            {formSteps === 0 && (
              <OutlinedButton
                onClick={() => router.back()}
                className={classNames('text-[#01052D] hover:text-[#01052D] flex items-center py-3 px-4 rounded-big w-full sm:w-auto justify-center ml-4 mt-2 md:mt-0 bg-E6EAEF border-none hover:bg-E6EAEF focus-visible:ring-E6EAEF ')}
              >
                <Trans>Cancel</Trans>
              </OutlinedButton>
            )}

            {formSteps > 0 && (
              <BackButton
                className={classNames('flex items-center py-3 px-4 rounded-big w-full sm:w-auto justify-center uppercase tracking-wide ml-4 mt-2 md:mt-0')}
                onClick={() => setFormSteps((prev) => prev - 1)}
              />)}

          </div>
        )}
        <PurchasePolicyModal isOpen={purchaseWaiting || Boolean(txHash)} txHash={txHash} />
      </div>

    </div>
  )
}

export const ReferralCodeStatus = ({
  isReferralCodeCheckPending = true,
  isValidReferralCode,
  statusIndicatorClass = 'right-6 top-6'
}) => {
  if (isReferralCodeCheckPending) {
    return (
      <Loader
        className={classNames('absolute w-6 h-6  text-4e7dd9', statusIndicatorClass)}
        aria-hidden='true'
        data-testid='loader'
      />
    )
  }

  if (isValidReferralCode) {
    return (
      <SuccessIcon
        className={classNames('absolute w-6 h-6 text-21AD8C', statusIndicatorClass)}
        aria-hidden='true'
      />
    )
  }

  return (
    <ErrorIcon
      className={classNames('absolute w-6 h-6 text-FA5C2F', statusIndicatorClass)}
      aria-hidden='true'
    />
  )
}
