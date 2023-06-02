import { IncreaseYourBoost } from '@/modules/governance/view-proposals/IncreaseYourBoost'
import { KeyVal } from '@/modules/governance/view-proposals/KeyVal'
import { useVoteEscrowData } from '@/src/hooks/contracts/useVoteEscrowData'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const ViewProposals = () => {
  const { account } = useWeb3React()
  const { data: { veNPMBalance, unlockTimestamp }, currentBoostAndVotingPower: { boostBN, votingPower } } = useVoteEscrowData()

  const unlockDate = (unlockTimestamp !== '0' ? fromNow(new Date(unlockTimestamp)) : 'N/A')
  const boost = parseFloat(boostBN.toString()).toFixed(2) + 'x'

  return (
    <div className='flex flex-col items-center gap-8 p-8 bg-white border lg:flex-row rounded-2xl border-B0C4DB'>
      <div className='flex-1 w-full'>
        <h2 className='text-xl font-semibold'>
          <Trans>View Proposals</Trans>
        </h2>
        <div className='p-6 mt-6 break-all rounded-2 bg-F3F5F7 md:break-words'>
          <KeyVal
            title='Account'
            value={account || 'N/A'}
          />

          <div className='flex flex-wrap items-center gap-8 mt-4'>
            <KeyVal valueXl title='Vote-Locked Balance' value={veNPMBalance.long} />
            <KeyVal valueXl title='Boost' value={boost} />
            <KeyVal valueXl title='Voting Power' value={votingPower.long} />
          </div>

          <KeyVal
            title='Unlock At:'
            value={unlockDate}
            className='mt-8'
          />
        </div>
      </div>

      <IncreaseYourBoost boostBn={boostBN} />
    </div>
  )
}
