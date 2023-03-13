import { useState, useEffect, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useClaimPolicyInfo } from '@/src/hooks/useClaimPolicyInfo'
import { convertFromUnits, isGreater, toBN } from '@/utils/bn'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useCxTokenRowContext } from '@/src/modules/my-policies/CxTokenRowContext'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { formatPercent } from '@/utils/formatter/percent'
import { DEBOUNCE_TIMEOUT, MULTIPLIER } from '@/src/config/constants'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { useWeb3React } from '@web3-react/core'
import { analyticsLogger } from '@/utils/logger'
import { log } from '@/src/services/logs'

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

  const { account, chainId } = useWeb3React()

  const handleLog = useCallback((sequence) => {
    const funnel = 'Claim Cover'
    const journey = 'my-policies-list-claims-page'
    let step, event

    switch (sequence) {
      case 2:
        step = 'claim-cover-modal'
        event = 'pop-up'
        break

      case 3:
        step = 'approve-button'
        event = 'click'
        break

      case 4:
        step = 'claim-button'
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
  }, [account, chainId])

  // Clear on modal close
  useEffect(() => {
    if (isOpen) {
      handleLog(2)
      return
    }

    setValue('')
  }, [handleLog, isOpen])

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

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = t`Fetching balance...`
  } else if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={approving || claiming}
      data-testid='claim-cover-modal'
    >
      <ModalWrapper className='max-w-md bg-f6f7f9'>
        <Dialog.Title
          className='flex items-center w-full font-bold font-inter text-h2'
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
            labelText={t`Enter your ${tokenSymbol}`}
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
                className='w-full p-6 font-semibold uppercase text-h6'
                disabled={!value || approving || error || loadingMessage}
                onClick={() => {
                  handleApprove()
                  handleLog(3)
                }}
                data-testid='approve-button'
              >
                {approving ? t`Approving...` : t`Approve`}
              </RegularButton>
              )
            : (
              <RegularButton
                disabled={!canClaim || claiming || error || loadingMessage}
                className='w-full p-6 font-semibold uppercase text-h6'
                onClick={() => {
                  handleClaim(() => {
                    setValue('')
                  })
                  handleLog(4)
                  handleLog(9999)
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
