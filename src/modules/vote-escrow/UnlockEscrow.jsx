import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import BackIcon from '@/icons/BackIcon'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'
import { PREMATURE_UNLOCK_PENALTY_FRACTION } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useVoteEscrowUnlock } from '@/src/hooks/contracts/useVoteEscrowUnlock'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import {
  t,
  Trans
} from '@lingui/macro'

const UnlockEscrow = ({
  onBack,
  veNPMBalance,
  veNPMTokenAddress,
  veNPMTokenSymbol,
  veNPMTokenDecimals,
  unlockTimestamp,
  refetchLockData
}) => {
  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()

  const {
    approving,
    handleApprove,
    hasAllowance,
    loadingAllowance,
    isPrematureUnlock,
    unlock,
    unlocking
  } = useVoteEscrowUnlock({
    refetchLockData,
    veNPMBalance,
    veNPMTokenSymbol,
    veNPMTokenAddress,
    veNPMTokenDecimals,
    unlockTimestamp
  })

  const penaltyAmount = isPrematureUnlock
    ? toBN(veNPMBalance).multipliedBy(PREMATURE_UNLOCK_PENALTY_FRACTION).toString()
    : '0'

  const receiveAmount = toBN(veNPMBalance).minus(penaltyAmount).toString()

  const formattedPenaltyAmount = formatCurrency(convertFromUnits(penaltyAmount, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedReceiveAmount = formatCurrency(convertFromUnits(receiveAmount, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)

  let loadingMessage = ''
  if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`
  }

  return (
    <VoteEscrowCard>
      <VoteEscrowTitle title='Unlock veNPM' />
      <EscrowSummary
        veNPMBalance={veNPMBalance}
        veNPMTokenSymbol={veNPMTokenSymbol}
        unlockTimestamp={unlockTimestamp}
      />

      <div className='p-8'>
        <div className='mb-6'>
          <div
            className={classNames(
              'font-semibold text-center text-md',
              isPrematureUnlock ? 'text-E52E2E' : 'text-4E7DD9'
            )}
          >
            {isPrematureUnlock
              ? <Trans>Proceed with Caution</Trans>
              : <Trans>Penalty: {formatPercent(0)}</Trans>}
          </div>

          <DataLoadingIndicator message={loadingMessage} />

          {/* BUTTONS */}
          {!hasAllowance && (
            <RegularButton
              disabled={!!loadingMessage || approving}
              className={classNames(
                'w-full p-4 font-semibold rounded-tooltip text-md',
                isPrematureUnlock && 'bg-E52E2E border-E52E2E'
              )}
              onClick={handleApprove}
            >
              {
                approving
                  ? t`Approving...`
                  : <Trans>Approve VeNPM</Trans>
              }
            </RegularButton>
          )}

          {hasAllowance && !isPrematureUnlock && (
            <RegularButton
              disabled={!!loadingMessage || unlocking}
              className={classNames(
                'w-full p-4 font-semibold rounded-tooltip text-md',
                isPrematureUnlock && 'bg-E52E2E border-E52E2E'
              )}
              onClick={() => {
                unlock(onBack)
              }}
            >
              <Trans>unlock npm</Trans>
            </RegularButton>
          )}

          {hasAllowance && isPrematureUnlock && (
            <RegularButton
              disabled={!!loadingMessage || unlocking}
              className={classNames(
                'w-full p-4 font-semibold rounded-tooltip text-md',
                isPrematureUnlock && 'bg-E52E2E border-E52E2E'
              )}
              onClick={() => {
                unlock(onBack)
              }}
            >
              <Trans>prematurely unlock your npm</Trans>
            </RegularButton>
          )}

        </div>

        <KeyValueList
          className='mb-6'
          list={[
            {
              key: 'Penalty',
              value: formattedPenaltyAmount.long,
              caution: isPrematureUnlock
            },
            {
              key: 'You Will Receive',
              value: formattedReceiveAmount.long
            }
          ]}
        />

        <button
          className='uppercase flex items-center gap-2.5 font-semibold text-xs leading-6' onClick={() => {
            onBack()
          }}
        >
          <BackIcon />
          Back
        </button>
      </div>

    </VoteEscrowCard>
  )
}

export default UnlockEscrow
