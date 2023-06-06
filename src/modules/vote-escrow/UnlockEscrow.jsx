import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import BackIcon from '@/icons/BackIcon'
import DateLib from '@/lib/date/DateLib'
import EscrowSummary from '@/modules/vote-escrow/EscrowSummary'
import KeyValueList from '@/modules/vote-escrow/KeyValueList'
import VoteEscrowCard from '@/modules/vote-escrow/VoteEscrowCard'
import VoteEscrowTitle from '@/modules/vote-escrow/VoteEscrowTitle'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { useWeb3React } from '@web3-react/core'

const PENALTY_FRACTION = 0.25

const UnlockEscrow = ({
  onBack,
  data,
  loading,
  unlockNPMTokens,
  hasUnlockAllowance,
  handleApproveUnlock
}) => {
  const { active } = useWeb3React()
  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()

  const unlockDate = DateLib.fromUnix(data.unlockTimestamp)
  const isPrematureUnlock = Date.now().valueOf() - unlockDate.valueOf() < 0

  const penaltyAmount = isPrematureUnlock
    ? toBN(data.veNPMBalance).multipliedBy(PENALTY_FRACTION).toString()
    : '0'

  const receiveAmount = isPrematureUnlock
    ? toBN(data.veNPMBalance).minus(penaltyAmount).toString()
    : data.veNPMBalance

  const formattedPenaltyAmount = formatCurrency(convertFromUnits(penaltyAmount, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedReceiveAmount = formatCurrency(convertFromUnits(receiveAmount, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)

  return (
    <VoteEscrowCard>
      <VoteEscrowTitle title='Unlock veNPM' />
      <EscrowSummary
        veNPMBalance={data.veNPMBalance}
        unlockTimestamp={data.unlockTimestamp}
      />

      <div className='p-8'>
        {!isPrematureUnlock && (
          <div className='mb-6'>
            <div className='mb-6 font-semibold text-center text-md text-4E7DD9'>Penalty: {formatPercent(PENALTY_FRACTION)}%</div>
            <RegularButton
              className='w-full p-4 font-semibold rounded-tooltip text-md'
              onClick={() => {
                if (hasUnlockAllowance) {
                  unlockNPMTokens(isPrematureUnlock, () => {
                    onBack()
                  })
                } else {
                  handleApproveUnlock()
                }
              }}
            >{hasUnlockAllowance ? 'unlock npm' : 'Approve Unlock'}
            </RegularButton>
          </div>
        )}

        {isPrematureUnlock && (
          <div className='mb-6'>
            <div className='mb-6 font-semibold text-center text-md text-E52E2E'>Proceed with Caution</div>
            <RegularButton
              disabled={loading || !active} className='w-full p-4 font-semibold rounded-tooltip bg-E52E2E border-E52E2E text-md' onClick={() => {
                if (hasUnlockAllowance) {
                  unlockNPMTokens(isPrematureUnlock, () => {
                    onBack()
                  })
                } else {
                  handleApproveUnlock()
                }
              }}
            >{hasUnlockAllowance ? 'prematurely unlock your npm' : 'Approve premature unlock'}
            </RegularButton>
          </div>
        )}

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
          ].filter(Boolean)}
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
