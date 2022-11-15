import * as Tooltip from '@radix-ui/react-tooltip'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { convertFromUnits, isValidNumber } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { PolicyFeesAndExpiry } from '@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry'
import { t, Trans } from '@lingui/macro'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { useAppConstants } from '@/src/context/AppConstants'
import { useState } from 'react'
import { Radio } from '@/common/Radio/Radio'
import { Label } from '@/common/Label/Label'
import { RegularInput } from '@/common/Input/RegularInput'
import { ReferralCodeStatus } from '@/common/CoverForm/PurchasePolicyForm'

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
  handlePurchase,
  setValue,
  setReferralCode,
  setCoverMonth,
  referralCode,
  handleChange,
  balance,
  coverPeriodLabels,
  handleRadioChange,
  referralCodeErrorMessage,
  hasReferralCode

}) => {
  const { fee } = feeData
  const router = useRouter()
  const { liquidityTokenAddress, liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()

  const [editForm, setEditForm] = useState(false)

  const handleEditForm = () => {
    setEditForm(true)
  }

  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  return (
    <div>
      <DisabledInput value={coverFee} unit={liquidityTokenSymbol} />
      <div className='w-full px-8 py-6 mt-8 rounded-lg bg-F3F5F7'>
        <p className='font-semibold'>You will Receive:</p>
        <p className='flex items-center ml-2'>
          {formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).short} (Claimable {liquidityTokenSymbol} Token)
          <CxDaiToolTip liquidityTokenSymbol={liquidityTokenSymbol} coverName={coverName} />
        </p>
      </div>

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
              isReferralCodeCheckPending
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
              !isValidReferralCode
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

      <hr className='my-8 border-t border-dashed border-B0C4DB' />
      <div className='w-full px-8 py-6 mt-8 rounded-lg bg-F3F5F7'>
        <div className='flex items-center justify-between'>
          <p className='font-bold text-h4'>Coverage Information</p>
          {!editForm && <OutlinedButton className='rounded-md' onClick={handleEditForm}>Edit</OutlinedButton>}
          {editForm && (
            <div className='flex'>
              <OutlinedButton className='rounded-md' onClick={() => setEditForm(false)}>Cancel</OutlinedButton>
              <RegularButton className='px-4 ml-2' onClick={() => setEditForm(false)}>Done</RegularButton>
            </div>
          )}
        </div>
        <p className='mt-8 text-lg capitalize'>Amount you wish to cover</p>
        <TokenAmountInput
          onChange={handleChange}
          error={!!error}
          handleChooseMax={() => {}}
          tokenAddress={liquidityTokenAddress}
          tokenSymbol={liquidityTokenSymbol}
          tokenDecimals={liquidityTokenDecimals}
          tokenBalance={balance}
          inputId='cover-amount'
          inputValue={value}
          disabled={approving || purchasing || !editForm}
          buttonClassName='hidden'
        >
          {value && isValidNumber(value) && (
            <div
              className='flex items-center text-15aac8'
              title={formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).long}
            >
              <p>
                <Trans>You will receive:</Trans>{' '}
                {formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).short}
              </p>
            </div>
          )}
          {error && <p className='flex items-center text-FA5C2F'>{error}</p>}
        </TokenAmountInput>
        <div className='mt-6'>
          <PolicyFeesAndExpiry
            value={value}
            data={feeData}
            coverageLag={coverageLag}
            referralCode={referralCode}
            quotationStep={false}
            editForm={editForm}
          />
          {editForm && (
            <div className='flex mt-13'>
              <Radio
                label={coverPeriodLabels[0]}
                id='period-1'
                value='1'
                name='cover-period'
                disabled={approving || purchasing}
                onChange={handleRadioChange}
                checked={coverMonth === '1'}
              />
              <Radio
                label={coverPeriodLabels[1]}
                id='period-2'
                value='2'
                name='cover-period'
                disabled={approving || purchasing}
                onChange={handleRadioChange}
                checked={coverMonth === '2'}
              />
              <Radio
                label={coverPeriodLabels[2]}
                id='period-3'
                value='3'
                name='cover-period'
                disabled={approving || purchasing}
                onChange={handleRadioChange}
                checked={coverMonth === '3'}
              />
            </div>
          )}
          {editForm && (
            <>
              <hr className='mt-4 border-t border-d4dfee' />

              <div className='flex justify-between mt-11'>
                <Label htmlFor='referral_code' className='mt-3 mb-2'>
                  <Trans>Referral Code</Trans>
                </Label>

                <div className='relative'>
                  <RegularInput
                    className='leading-none disabled:cursor-not-allowed !text-h5 !pr-14 focus-visible:ring-0 !h-3'
                    error={!!referralCodeErrorMessage}
                    id='referral_code'
                    placeholder={t`Enter Referral Code`}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
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

                  {referralCodeErrorMessage && (
                    <p className='flex items-center mt-2 ml-3 text-FA5C2F'>
                      {referralCodeErrorMessage}
                    </p>
                  )}
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
        <div className='px-4 py-4 text-xs tracking-normal bg-black rounded-lg md:max-w-70 max-w-15 text-EEEEEE'>
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
