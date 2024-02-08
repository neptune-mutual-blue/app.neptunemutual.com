import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'

import DateLib from '@/lib/date/DateLib'
import {
  IncreaseYourBoost
} from '@/modules/governance/view-proposals/IncreaseYourBoost'
import { KeyVal } from '@/modules/governance/view-proposals/KeyVal'
import { MULTIPLIER } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useVoteEscrowData } from '@/src/hooks/contracts/useVoteEscrowData'
import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { calculateBoost } from '@/utils/calculate-boost'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const ViewProposals = () => {
  const { account } = useWeb3React()
  const { networkId } = useNetwork()
  const router = useRouter()
  const { NPMTokenDecimals, NPMTokenSymbol } = useAppConstants()
  const { data } = useVoteEscrowData()

  const lockDuration = toBNSafe(data.unlockTimestamp).isGreaterThan(DateLib.unix())
    ? toBNSafe(data.unlockTimestamp).minus(DateLib.unix()) // to duration left
      .decimalPlaces(0, BigNumber.ROUND_CEIL) // rounding
      .toNumber()
    : 0

  const boost = toBNSafe(calculateBoost(lockDuration)).dividedBy(MULTIPLIER).toString()

  const veNPMTokenSymbol = ChainConfig[networkId || 1].veNPM.tokenSymbol
  const votingPower = toBNSafe(boost).multipliedBy(data.lockedNPMBalance)
  const formattedVotingPower = formatCurrency(convertFromUnits(votingPower, NPMTokenDecimals), router.locale, NPMTokenSymbol, true)
  const formattedVeNPMBalance = formatCurrency(convertFromUnits(data.veNPMBalance, NPMTokenDecimals), router.locale, veNPMTokenSymbol, true)

  return (
    <div className='flex flex-col items-center gap-8 p-8 bg-white border lg:flex-row rounded-2xl border-B0C4DB'>
      <div className='flex-1 w-full'>
        <h2 className='text-xl font-semibold'>
          <Trans>View Proposals</Trans>
        </h2>
        <div className='p-6 mt-6 break-all rounded-2 bg-F3F5F7 md:break-words'>
          <KeyVal
            heading='Account'
            value={account || 'N/A'}
          />

          <div className='flex flex-wrap items-center gap-8 mt-4'>
            <KeyVal
              valueXl
              heading='Vote-Locked Balance'
              value={formattedVeNPMBalance.short}
              title={formattedVeNPMBalance.long}
            />
            <KeyVal
              valueXl
              heading='Boost'
              value={`${toBNSafe(boost).decimalPlaces(2).toString()}x`}
              title={toBNSafe(boost).decimalPlaces(6).toString()}
            />
            <KeyVal
              valueXl
              heading='Voting Power'
              value={formattedVotingPower.short}
              title={formattedVotingPower.long}
            />
          </div>

          <KeyVal
            heading='Unlock At:'
            className='mt-8'
            value={fromNow(data.unlockTimestamp)}
            title={DateLib.toLongDateFormat(data.unlockTimestamp, router.locale)}
          />
        </div>
      </div>

      <IncreaseYourBoost boost={boost} />
    </div>
  )
}
