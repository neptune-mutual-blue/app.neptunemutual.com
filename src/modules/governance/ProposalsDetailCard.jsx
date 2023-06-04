import { useRouter } from 'next/router'

import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import CheckCircleIcon from '@/icons/CheckCircleIcon'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { getBlockLink } from '@/lib/connect-wallet/utils/explorer'
import DateLib from '@/lib/date/DateLib'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { IPFS_HASH_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  getSubmitYourVoteUrl,
  snapshotColors
} from '@/utils/snapshot'
import { getReplacedString } from '@/utils/string'
import { Trans } from '@lingui/macro'

const ProposalsDetailCard = ({ title, snapshot, ipfs, startDate = '', endDate = '', state, category }) => {
  const router = useRouter()
  const { proposalId } = router.query

  const { networkId } = useNetwork()

  const convertDateFormat = (date) => {
    return DateLib.toLongDateFormat(date, router.locale, 'UTC', {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZoneName: 'short'
    })
  }

  return (
    <GovernanceCard className='flex flex-col gap-6 p-4 md:p-8'>
      <h1 className='text-xl font-semibold'><Trans>{title}</Trans></h1>

      <div className='flex flex-row gap-2'>
        <div className={`flex flex-row gap-1 ${state !== 'active' ? 'bg-[#EFF8FF] text-[#175CD3]' : 'bg-[#D92D20] text-white'} py-0.5 px-2 text-xs rounded-full font-medium items-center justify-center`}>
          {state !== 'active' && <CheckCircleIcon height={12} width={12} />}
          <Trans>{state !== 'active' ? 'Complete' : 'Live'}</Trans>
        </div>
        {category &&
        (
          <div
            className='py-0.5 px-2 text-xs rounded-full font-medium items-center justify-center'
            style={{
              background: snapshotColors[category.type].bg,
              color: snapshotColors[category.type].text
            }}
          >
            {category?.value}
          </div>
        )}
      </div>

      <div className='flex flex-col gap-4 p-6 sm:gap-0 sm:items-end sm:justify-between sm:flex-row bg-F3F5F7 rounded-2'>
        <div className='flex flex-col gap-4 sm:gap-8 sm:flex-row'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-999BAB'>
              <Trans>Proposal</Trans>
            </h4>
            <div className='flex flex-row gap-4'>
              <a
                className='underline text-4E7DD9 hover:no-underline'
                href={getSubmitYourVoteUrl(networkId, proposalId)}
                target='_blank'
                rel='noreferrer noopener nofollow'
              >
                <Trans>Snapshot</Trans>
              </a>
              <a
                className='underline text-4E7DD9 hover:no-underline'
                href={getReplacedString(IPFS_HASH_URL, { ipfsHash: ipfs })}
                target='_blank'
                rel='noreferrer noopener nofollow'
              >
                <Trans>IPFS</Trans>
              </a>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-999BAB'>
              <Trans>Start</Trans>
            </h4>
            <InfoTooltip
              infoComponent={convertDateFormat(startDate)} className='text-xs px-2 py-1.5 bg-opacity-100 max-w-none' positionOffset={0}
            >
              <p>{fromNow(startDate)}</p>
            </InfoTooltip>
          </div>

          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-999BAB'>
              <Trans>End</Trans>
            </h4>
            <InfoTooltip
              infoComponent={convertDateFormat(endDate)} className='text-xs px-2 py-1.5 bg-opacity-100 max-w-none' positionOffset={0}
            >
              <p>{fromNow(endDate)}</p>
            </InfoTooltip>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1'>
          <a
            className='font-semibold text-4E7DD9'
            href={getBlockLink(networkId, snapshot)}
            target='_blank'
            rel='noreferrer noopener nofollow'
          >
            #{snapshot}
          </a>
          <InfoTooltip infoComponent={`Snapshot taken at block number ${snapshot}`} className='text-xs px-2 py-1.5 bg-opacity-100 max-w-none'>
            <button type='button' className='cursor-default'>
              <InfoCircleIcon className='w-4 h-4' />
            </button>
          </InfoTooltip>
        </div>
      </div>
    </GovernanceCard>
  )
}

export default ProposalsDetailCard
