import {
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { AccountDetail } from '@/modules/governance/AccountDetail'
import LiquidityGauge from '@/modules/governance/LiquidityGauge'
import { ProposalDetailCard } from '@/modules/governance/ProposalDetailCard'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { EMISSION_PER_EPOCH } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useSnapshotProposalById } from '@/src/hooks/useSnapshotProposalById'
import {
  sumOf,
  toBN
} from '@/utils/bn'
import {
  getChainsFromChoices,
  getResultsByChains,
  getTagFromTitle,
  getVotingResults
} from '@/utils/snapshot'
import {
  t,
  Trans
} from '@lingui/macro'

export const GovernanceSinglePage = () => {
  const router = useRouter()
  const { proposalId } = router.query

  const [selectedChains, setSelectedChains] = useState([])
  const { data: proposalDetail, loading } = useSnapshotProposalById(proposalId)

  const {
    isValidProposal,
    chainIds,
    filteredResults,
    emissionOfSelectedChains,
    distribution
  } = useMemo(() => {
    if (!proposalDetail) {
      return {}
    }

    const isValidProposal = getTagFromTitle(proposalDetail.title) === 'gce'
    const chainIds = getChainsFromChoices(proposalDetail.choices)

    const filteredResults = getResultsByChains(getVotingResults(proposalDetail.choices, proposalDetail.scores), selectedChains)

    const percentSum = sumOf(...filteredResults.map(x => { return x.percent }))
    const emissionOfSelectedChains = toBN(EMISSION_PER_EPOCH).multipliedBy(percentSum).toString()

    const distribution = filteredResults.map(result => {
      return {
        key: result.key,
        emission: toBN(EMISSION_PER_EPOCH).multipliedBy(result.percent).toString()
      }
    })

    return {
      isValidProposal,
      chainIds,
      filteredResults,
      emissionOfSelectedChains,
      distribution
    }
  }, [proposalDetail, selectedChains])

  if (loading) {
    return <ProposalSkeleton />
  }

  if (!proposalDetail) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
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
            name: t`${proposalDetail.title}`,
            href: '#',
            current: true
          }
        ]}
      />
      <div className='flex flex-col gap-8'>
        <ProposalDetailCard
          proposalId={proposalId}
          title={proposalDetail.title}
          snapshot={proposalDetail.snapshot}
          ipfs={proposalDetail.ipfs}
          start={proposalDetail.start}
          end={proposalDetail.end}
          state={proposalDetail.state}
        />

        {isValidProposal && (
          <LiquidityGauge
            results={filteredResults}
            selectedChains={selectedChains}
            setSelectedChains={setSelectedChains}
            chainIds={chainIds}
            emission={emissionOfSelectedChains}
            start={proposalDetail.start}
            end={proposalDetail.end}
            state={proposalDetail.state}
          />)}

        {isValidProposal && selectedChains.length === 1 && (
          <AccountDetail
            title={proposalDetail.title}
            selectedChain={selectedChains[0]}
            distribution={distribution}
            amountToDeposit={emissionOfSelectedChains}
          />
        )}
      </div>
    </Container>
  )
}
