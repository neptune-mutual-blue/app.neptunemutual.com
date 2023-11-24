import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { BackButton } from '@/common/BackButton/BackButton'
import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { AbnormalCoverStatus } from '@/common/CoverForm/AbnormalStatus'
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
  CoverStatus,
  MAX_PROPOSAL_AMOUNT,
  MIN_PROPOSAL_AMOUNT
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useNotifier } from '@/src/hooks/useNotifier'
import { usePolicyFees } from '@/src/hooks/usePolicyFees'
import { usePurchasePolicy } from '@/src/hooks/usePurchasePolicy'
import { useValidateReferralCode } from '@/src/hooks/useValidateReferralCode'
import {
  convertFromUnits,
  isGreater
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

const getMonthEnd = (month, fullYear) => {
  const d = new Date(fullYear, month + 1, 0)

  return d.getDate()
}

const getCoveragePeriodLabels = (locale) => {
  const now = new Date()
  const day = now.getUTCDate()
  const currentMonthIndex = now.getUTCMonth()
  const fullYear = now.getUTCFullYear()

  const monthNames = getMonthNames(locale, true)

  // @note: Refer `getExpiryDateInternal` in protocol
  // https://github.com/neptune-mutual-blue/protocol/blob/a98fcce3657d80814f2aca67a4a8a3534ff8da2d/contracts/libraries/CoverUtilV1.sol#L599-L613
  if (day >= 25) {
    return [
      monthNames[(currentMonthIndex + 1) % 12] + getMonthEnd((currentMonthIndex + 1), fullYear),
      monthNames[(currentMonthIndex + 2) % 12] + getMonthEnd((currentMonthIndex + 2), fullYear),
      monthNames[(currentMonthIndex + 3) % 12] + getMonthEnd((currentMonthIndex + 3), fullYear)
    ]
  }

  return [
    monthNames[(currentMonthIndex + 0) % 12] + ' ' + getMonthEnd((currentMonthIndex + 0), fullYear),
    monthNames[(currentMonthIndex + 1) % 12] + ' ' + getMonthEnd((currentMonthIndex + 1), fullYear),
    monthNames[(currentMonthIndex + 2) % 12] + ' ' + getMonthEnd((currentMonthIndex + 2), fullYear)
  ]
}

export const PurchasePolicyForm = ({
  coverKey,
  productKey,
  availableForUnderwriting,
  projectOrProductName,
  coverageLag,
  parameters,
  isUserWhitelisted,
  requiresWhitelist,
  activeIncidentDate,
  productStatus
}) => {
  const router = useRouter()
  const { notifier } = useNotifier()
  const { networkId } = useNetwork()

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
  const availableLiquidity = convertFromUnits(
    availableForUnderwriting,
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

  useEffect(() => {
    const { amount } = router.query
    if (typeof amount === 'string' && Number(amount)) {
      setValue(amount)
    }
  }, [router.query])

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

  const { account } = useWeb3React()

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
    setReferralCode(e.target.value.toUpperCase())
  }

  const coverPeriodLabels = getCoveragePeriodLabels(router.locale)

  let canProceed = true
  if (formSteps === 0) {
    const invalidAmount = !value ||
    isGreater(value, availableLiquidity) ||
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

  const hasReferralCode = !!referralCode.trim().length
  const isDiversified = isValidProduct(productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  const status = CoverStatus[productStatus]
  if (status && status !== 'Normal') {
    return (
      <div>
        <AbnormalCoverStatus
          status={status}
          coverKey={coverKey}
          productKey={productKey}
          activeIncidentDate={activeIncidentDate}
          imgSrc={imgSrc}
          name={projectOrProductName}
          className='mb-44'
        />

        <BackButton className='mx-auto' onClick={() => { return router.back() }} />
      </div>
    )
  }

  return (
    <div className='flex flex-col w-616' data-testid='purchase-policy-form-container'>
      {formSteps === 0 && value && <StepsIndicator completed='50' />}
      {formSteps === 1 && <StepsIndicator completed={value && coverMonth ? '100' : '50'} />}
      <div className='w-full p-4 rounded-xl bg-FEFEFF md:p-9 border-B0C4DB border-1.5' data-testid='purchase-policy-form'>
        <h4 className='flex items-center justify-center pb-6 text-sm font-bold text-center capitalize'>
          <div className='w-8 h-8 p-1 mr-2.5 rounded-full bg-DEEAF6'>
            <img
              src={imgSrc} alt=''
            />
          </div>
          <span>{projectOrProductName} Price Quotation</span>
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
            coverKey={coverKey}
            productKey={productKey}
            projectOrProductName={projectOrProductName}
            parameters={parameters}
            imgSrc={imgSrc}
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
              data-testid='accept-rules'
            >
              <Trans>
                I have read, understood, and agree to the cover terms, parameters, and exclusions, as well as the standard exclusions.
              </Trans>
            </Checkbox>

          </>
        )}

        {formSteps === 3 && (
          <PurchasePolicyStep
            projectOrProductName={projectOrProductName}
            feeData={feeData}
            value={value}
            approving={approving}
            canPurchase={canPurchase}
            coverMonth={coverMonth}
            coverageLag={coverageLag}
            error={error}
            handleApprove={handleApprove}
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
                className='leading-none disabled:cursor-not-allowed !text-md !pr-14 focus-visible:ring-0 text-center'
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
                <h5 className='font-semibold text-md'>Wallet Not Connected.</h5>
                <p>Please connect your wallet to view the price quotation.</p>
              </div>
              <ConnectWallet networkId={networkId} notifier={notifier}>
                {({ onOpen }) => {
                  return (
                    <RegularButton className='py-1.5 px-2.5 text-sm h-fit' onClick={onOpen}>Connect Wallet</RegularButton>
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
                'disabled:cursor-not-allowed disabled:opacity-50',
                'flex items-center text-EEEEEE py-3 px-4 rounded-big w-full sm:w-auto justify-center uppercase tracking-wide ml-4 mt-2 md:mt-0 bg-primary'
              )}
              onClick={() => {
                if (formSteps === 1) {
                  !isValidReferralCode && setReferralCode('')
                }
                setFormSteps((prev) => { return prev + 1 })
              }}
              data-testid='form-steps-button'
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
                onClick={() => { return router.back() }}
                className={classNames('text-[#01052D] hover:text-[#01052D] flex items-center py-3 px-4 rounded-big w-full sm:w-auto justify-center ml-4 mt-2 md:mt-0 !bg-E6EAEF border-none focus-visible:ring-E6EAEF ')}
              >
                <Trans>Cancel</Trans>
              </OutlinedButton>
            )}

            {formSteps > 0 && (
              <BackButton
                className={classNames('flex items-center py-3 px-4 rounded-big w-full sm:w-auto justify-center uppercase ml-4 mt-2 md:mt-0')}
                onClick={() => { return setFormSteps((prev) => { return prev - 1 }) }}
              />)}

          </div>
        )}
        <PurchasePolicyModal isOpen={purchaseWaiting || Boolean(txHash)} txHash={txHash} amount={Number(value || '0')} />
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
        className={classNames('absolute w-6 h-6  text-4E7DD9', statusIndicatorClass)}
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
