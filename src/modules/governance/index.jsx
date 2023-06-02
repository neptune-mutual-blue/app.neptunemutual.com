import { useState } from 'react'

import { useRouter } from 'next/router'

import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import AccountDetail from '@/modules/governance/AccountDetail'
import LiquidityGauge from '@/modules/governance/LiquidityGauge'
import ProposalsDetailCard from '@/modules/governance/ProposalsDetailCard'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { Routes } from '@/src/config/routes'
import { useSnapshotProposalsById } from '@/src/hooks/useSnapshotProposalsById'
import { getTagFromTitle } from '@/utils/getTagFromTitle'
import { t } from '@lingui/macro'

const GovernanceSinglePage = () => {
  const router = useRouter()
  const { proposalId } = router.query

  const { data: proposalDetail, loading } = useSnapshotProposalsById(proposalId)
  const [selectedChains, setSelectedChains] = useState([])

  const filteredScores = selectedChains.length === 0 ? proposalDetail?.scores : proposalDetail?.scores.filter(value => selectedChains.includes(value.chainId))

  if (loading) {
    return <ProposalSkeleton />
  }

  return (
    <Container>
      <BreadCrumbs
        data-testid='breadcrumbs'
        pages={[
          {
            name: t`Governance`,
            href: Routes.Governance,
            current: false
          },
          {
            name: t`${proposalDetail?.title}`,
            href: '#',
            current: true
          }
        ]}
      />
      <div className='flex flex-col gap-8'>
        <ProposalsDetailCard
          title={proposalDetail?.title}
          snapshot={proposalDetail?.snapshot}
          ipfs={proposalDetail?.ipfs}
          startDate={proposalDetail?.start}
          endDate={proposalDetail?.end}
          state={proposalDetail?.state}
          category={proposalDetail?.category}
        />

        {proposalDetail && getTagFromTitle(proposalDetail?.title) === 'gce' &&
          <LiquidityGauge
            state={proposalDetail?.state}
            data={filteredScores}
            selectedChains={selectedChains}
            setSelectedChains={setSelectedChains}
            chainOption={proposalDetail?.chains}
          />}

        <AccountDetail title={proposalDetail?.title} selectedChains={selectedChains} />
      </div>
    </Container>
  )
}

export default GovernanceSinglePage
