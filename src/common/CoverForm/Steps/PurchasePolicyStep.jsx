import { DisabledInput } from '@/common/Input/DisabledInput'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { PolicyFeesAndExpiry } from '@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry'
import { t, Trans } from '@lingui/macro'

const PurchasePolicyStep = ({
  value,
  feeData,
  liquidityTokenSymbol,
  liquidityTokenDecimals,
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
  referralCode
}) => {
  const { fee } = feeData
  const router = useRouter()

  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  return (
    <div>
      <DisabledInput value={coverFee} unit={liquidityTokenSymbol} />
      <div className='w-full px-8 py-6 mt-8 rounded-lg bg-F3F5F7'>
        <p className='font-semibold'>You will Receive:</p>
        <p className='flex items-center ml-2'>{formatCurrency(value, router.locale, 'cx' + liquidityTokenSymbol, true).short} (Claimable USDC Token) <span><InfoCircleIcon width={24} className='fill-9B9B9B' /></span></p>
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
          <OutlinedButton className='rounded-md'>Edit</OutlinedButton>
        </div>
        <p className='mt-8 text-lg capitalize'>Amount you wish to cover</p>
        <DisabledInput
          value={value}
          unit={liquidityTokenSymbol}
        />
        <div className='mt-6'>
          <PolicyFeesAndExpiry value={value} data={feeData} coverageLag={coverageLag} referralCode={referralCode} quotationStep={false} />
        </div>
      </div>
    </div>
  )
}

export default PurchasePolicyStep
