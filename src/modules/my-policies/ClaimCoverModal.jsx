import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import {
  DEBOUNCE_TIMEOUT,
  MULTIPLIER
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useClaimPolicyInfo } from '@/src/hooks/useClaimPolicyInfo'
import { useDebounce } from '@/src/hooks/useDebounce'
import {
  useCxTokenRowContext
} from '@/src/modules/my-policies/CxTokenRowContext'
import {
  convertFromUnits,
  isGreater,
  toBN
} from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as Dialog from '@radix-ui/react-dialog'

export const ClaimCoverModal = ({
  modalTitle,
  isOpen,
  onClose,
  coverKey,
  productKey,
  incidentDate,
  cxTokenAddress,
  claimPlatformFee
}) => {
  const [value, setValue] = useState('')
  const delayedValue = useDebounce(value, DEBOUNCE_TIMEOUT)
  const { balance, loadingBalance, tokenSymbol, tokenDecimals } =
    useCxTokenRowContext()
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const {
    canClaim,
    claiming,
    handleClaim,
    approving,
    handleApprove,
    receiveAmount,
    error,
    loadingAllowance
  } = useClaimPolicyInfo({
    value: delayedValue,
    cxTokenAddress,
    cxTokenDecimals: tokenDecimals,
    cxTokenSymbol: tokenSymbol,
    coverKey,
    productKey,
    incidentDate,
    claimPlatformFee,
    tokenSymbol
  })
  const router = useRouter()

  // Clear on modal close
  useEffect(() => {
    if (isOpen) {
      return
    }

    setValue('')
  }, [isOpen])

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance, tokenDecimals).toString())
  }

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setValue(val)
    }
  }

  const isDiversified = isValidProduct(productKey)

  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  const { i18n } = useLingui()

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = t(i18n)`Fetching balance...`
  } else if (loadingAllowance) {
    loadingMessage = t(i18n)`Fetching allowance...`
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={approving || claiming}
      data-testid='claim-cover-modal'
    >
      <ModalWrapper className='max-w-md bg-F6F7F9'>
        <Dialog.Title
          className='flex items-center w-full font-bold text-display-sm'
          data-testid='dialog-title'
        >
          <img src={imgSrc} alt={t`policy`} height={48} width={48} />
          <span className='pl-3'>{modalTitle}</span>
        </Dialog.Title>
        <ModalCloseButton
          disabled={approving || claiming}
          onClick={onClose}
        />
        <div className='mt-6' data-testid='token-input'>
          <TokenAmountInput
            inputId='cx-token'
            tokenAddress={cxTokenAddress}
            tokenDecimals={tokenDecimals}
            tokenSymbol={tokenSymbol}
            tokenBalance={balance}
            labelText={<Trans>Enter your {tokenSymbol}</Trans>}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id='bond-amount'
            disabled={approving || claiming}
            onChange={handleChange}
            error={!!error}
          >
            {error && (
              <p className='text-FA5C2F' data-testid='error-text'>
                {error}
              </p>
            )}
          </TokenAmountInput>
        </div>
        <div className='mt-8 modal-unlock' data-testid='receive-info-container'>
          <Label className='mb-4 font-semibold'>
            <Trans>You will receive</Trans>
          </Label>
          <DisabledInput
            value={convertFromUnits(
              receiveAmount,
              liquidityTokenDecimals
            ).toString()}
            unit={liquidityTokenSymbol}
          />
          <p className='px-3 pt-2 text-9B9B9B'>
            {isGreater(claimPlatformFee, '0') && (
              <>
                <Trans>
                  Fee:{' '}
                  {formatPercent(
                    toBN(claimPlatformFee).dividedBy(MULTIPLIER).toString(),
                    router.locale
                  )}
                </Trans>
              </>
            )}
          </p>
        </div>

        <div className='mt-6'>
          <DataLoadingIndicator message={loadingMessage} />
          {!canClaim
            ? (
              <RegularButton
                className='w-full p-6 font-semibold uppercase'
                disabled={!value || approving || error || loadingMessage}
                onClick={() => {
                  handleApprove()
                }}
                data-testid='approve-button'
              >
                {approving ? t`Approving...` : t`Approve`}
              </RegularButton>
              )
            : (
              <RegularButton
                disabled={!canClaim || claiming || error || loadingMessage}
                className='w-full p-6 font-semibold uppercase'
                onClick={() => {
                  handleClaim(() => {
                    setValue('')
                  })
                }}
                data-testid='claim-button'
              >
                {claiming ? t`Claiming...` : t`Claim`}
              </RegularButton>
              )}
        </div>
      </ModalWrapper>
    </ModalRegular>
  )
}
