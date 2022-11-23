import * as Tooltip from '@radix-ui/react-tooltip'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { OutlinedButton, OutlinedButtonCancel } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { PolicyFeesAndExpiry } from '@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry'
import { t, Trans } from '@lingui/macro'
import { useAppConstants } from '@/src/context/AppConstants'
import { useEffect, useState } from 'react'
import { CustomRadio } from '@/common/Radio/Radio'
import { Label } from '@/common/Label/Label'
import { RegularInput } from '@/common/Input/RegularInput'
import { ReferralCodeStatus } from '@/common/CoverForm/PurchasePolicyForm'
import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'
import { classNames } from '@/utils/classnames'
import { Alert } from '@/common/Alert/Alert'

const PurchasePolicyStep = ({
  coverName,
  value,
  feeData,
  loadingMessage,
  canPurchase,
  error,
  approving,
  coverMonth,
  updatingFee,
  updatingBalance,
  isReferralCodeCheckPending,
  coverageLag,
  handleApprove,
  handleLog,
  purchasing,
  isValidReferralCode,
  referralCodeChange,
  handlePurchase,
  setValue,
  setReferralCode,
  setCoverMonth,
  referralCode,
  handleChange,
  coverPeriodLabels,
  handleRadioChange,
  referralCodeErrorMessage,
  hasReferralCode

}) => {
  const { fee } = feeData
  const router = useRouter()
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()

  const [editForm, setEditForm] = useState(false)
  const [oldValue, setOldValue] = useState()

  const [radioProgress, setRadioProgress] = useState(0)

  const handleEditForm = () => {
    setOldValue(value)
    setEditForm(true)
  }

  const handleCancel = () => {
    handleChange(oldValue)
    setEditForm(false)
  }

  useEffect(() => {
    if (coverMonth === '3') {
      setRadioProgress(100)
    }
    if (coverMonth === '2') {
      setRadioProgress(50)
    }
    if (coverMonth === '1') {
      setRadioProgress(0)
    }
  }, [coverMonth])

  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  return (
    <div>
      <p className='text-lg text-center text-999BAB'><Trans>You Will Pay</Trans></p>
      <p
        className='flex justify-center mt-1 mb-8 font-bold text-center text-h1 text-4e7dd9'
        title={formatCurrency(
          coverFee,
          router.locale,
          liquidityTokenSymbol,
          true
        ).long}
      >
        {updatingFee
          ? (
            <span>
              <DataLoadingIndicator className='mt-0 text-center' message='Fetching fees...' />
            </span>
            )
          : formatCurrency(
            error ? 'N/A' : coverFee,
            router.locale,
            liquidityTokenSymbol,
            true
          ).short}
      </p>
      <div className='w-full px-8 py-6 mt-8 rounded-lg bg-F3F5F7'>
        <p className='font-semibold tracking-wider uppercase'>You will Receive:</p>
        <p className='flex items-center'>
          {formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).long} (Claimable {liquidityTokenSymbol} Token)
          <CxDaiToolTip liquidityTokenSymbol={liquidityTokenSymbol} coverName={coverName} />
        </p>
      </div>

      {error && error === 'Insufficient Balance' && (
        <Alert className='flex items-center text-FA5C2F'>Your balance is not enough to pay the fee. Please reload your wallet.</Alert>
      )}

      <div className='mt-4'>
        <DataLoadingIndicator message={loadingMessage} />
        {!canPurchase
          ? (
            <RegularButton
              disabled={
              !!error ||
              approving ||
              !value ||
              !coverMonth ||
              updatingFee ||
              updatingBalance ||
              isReferralCodeCheckPending ||
              editForm
            }
              className='w-full p-6 font-semibold uppercase text-h6'
              onClick={() => {
                handleApprove()
                handleLog(1)
              }}
            >
              {approving
                ? (
                    t`Approving...`
                  )
                : (
                  <>
                    <Trans>Approve</Trans> {liquidityTokenSymbol}
                  </>
                  )}
            </RegularButton>
            )
          : (
            <RegularButton
              disabled={
              !!error ||
              purchasing ||
              !value ||
              !coverMonth ||
              updatingFee ||
              updatingBalance ||
              !isValidReferralCode ||
              editForm
            }
              className='w-full p-6 font-semibold uppercase text-h6'
              onClick={() => {
                handlePurchase(() => {
                  setValue('')
                  setReferralCode('')
                  setCoverMonth('')
                })
                handleLog(2)
                handleLog(9999)
              }}
            >
              {purchasing ? t`Purchasing...` : t`Purchase Policy`}
            </RegularButton>
            )}
      </div>

      <p className='h-px my-8 bg-left-top bg-repeat-x bg-dashed-border bg-dashed-size' />

      <div className='w-full px-2 py-6 mt-8 rounded-lg md:px-8 bg-F3F5F7'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <p className='font-bold text-receipt-info'>Coverage Information</p>
          {!editForm && <OutlinedButton disabled={approving} className={classNames('rounded-md !py-1 mt-3 md:mt-0', approving && 'opacity-60 cursor-not-allowed')} onClick={!approving && handleEditForm}>Edit</OutlinedButton>}
          {editForm && (
            <div className='flex mt-3 md:mt-0'>
              <OutlinedButtonCancel className='rounded-md' onClick={handleCancel}>Cancel</OutlinedButtonCancel>
              <RegularButton
                disabled={isReferralCodeCheckPending}
                className='px-4 ml-2 !py-1' onClick={() => {
                  setEditForm(false)
                  !isValidReferralCode && setReferralCode('')
                }}
              >Done
              </RegularButton>
            </div>
          )}
        </div>
        <p className='mt-8 mb-4 text-lg font-semibold tracking-wider uppercase'>Amount you wish to cover</p>
        <div className={classNames(!editForm && 'opacity-40')}>
          <InputWithTrailingButton
            decimalLimit={liquidityTokenDecimals}
            error={!!error}
            buttonProps={{
              children: t`Max`,
              onClick: () => {},
              disabled: approving || purchasing || !editForm,
              buttonClassName: 'hidden'
            }}
            unit={liquidityTokenSymbol}
            unitClass='font-semibold !text-black'
            inputProps={{
              id: 'cover-amount',
              disabled: approving || purchasing || !editForm,
              placeholder: t`Enter Amount`,
              value: value,
              onChange: handleChange,
              allowNegativeValue: false
            }}
          />
        </div>
        {error && error !== 'Insufficient Balance' && <p className='flex items-center text-FA5C2F'>{error}</p>}
        <div className='mt-6'>
          <PolicyFeesAndExpiry
            value={value}
            data={feeData}
            coverageLag={coverageLag}
            referralCode={referralCode}
            quotationStep={false}
            editForm={editForm}
            updatingFee={updatingFee}
          />
          {editForm && (
            <div className='relative flex mt-11'>
              <div className='absolute h-2 bg-999BAB bg-opacity-30 top-1.5' style={{ width: 'calc(100% - 20px)' }} />
              <div className='absolute h-2 bg-4e7dd9 top-1.5' style={{ width: `calc(0% + ${radioProgress}%)` }} />
              <CustomRadio
                label={`${coverPeriodLabels[0].substr(0, 3)} 31`}
                className='!items-start flex-col'
                labelClass='mt-2 !text-h5 tracking-wider'
                id='period-1'
                value='1'
                name='cover-period-1'
                disabled={approving || purchasing}
                onClick={handleRadioChange}
                checked={parseInt(coverMonth) >= 1}
              />
              <CustomRadio
                label={`${coverPeriodLabels[1].substr(0, 3)} 31`}
                className='!items-center flex-col'
                labelClass='mt-2 !text-h5 tracking-wider'
                id='period-2'
                value='2'
                name='cover-period-2'
                disabled={approving || purchasing}
                onClick={handleRadioChange}
                checked={parseInt(coverMonth) >= 2}
              />
              <CustomRadio
                label={`${coverPeriodLabels[2].substr(0, 3)} 31`}
                className='!items-end flex-col'
                labelClass='mt-2 !text-h5 tracking-wider'
                id='period-3'
                value='3'
                name='cover-period-3'
                disabled={approving || purchasing}
                onClick={handleRadioChange}
                checked={parseInt(coverMonth) >= 3}
              />
            </div>
          )}
          {editForm && (
            <>
              <hr className='border-t mt-7 border-B0C4DB' />

              <div className='flex justify-between mt-6'>
                <Label htmlFor='referral_code' className='mt-3 mb-2 tracking-wider'>
                  <Trans>Referral Code</Trans>
                </Label>

                <div className='relative'>
                  <RegularInput
                    className='leading-none disabled:cursor-not-allowed !text-h5 !pr-14 focus-visible:ring-0 !h-3 text-center'
                    error={!!referralCodeErrorMessage}
                    id='referral_code'
                    placeholder={t`Enter Referral Code`}
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
                        statusIndicatorClass='right-3 top-3'
                      />
                      )
                    : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchasePolicyStep

const CxDaiToolTip = ({ liquidityTokenSymbol, coverName }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className='p-0.5'>
        <span className='sr-only'>Info</span>
        <InfoCircleIcon width={24} className='fill-9B9B9B' />
      </Tooltip.Trigger>

      <Tooltip.Content side='right'>
        <div className='w-full p-2 text-xs tracking-normal bg-black rounded-lg max-w-70 text-EEEEEE'>
          <p>
            You will receive cx{liquidityTokenSymbol} or Claimable {liquidityTokenSymbol} upon successful completion of this transaction.
          </p>
          <p className='mt-6'>
            The cx{liquidityTokenSymbol} token will be redeemable for {liquidityTokenSymbol} at a 1:1 ratio if {coverName} cover resolves as “Incident Occured”
          </p>
        </div>
        <Tooltip.Arrow offset={16} className='fill-black' />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
