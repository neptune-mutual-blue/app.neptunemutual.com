import { useState } from 'react'

import { Alert } from '@/common/Alert/Alert'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { AccountDetail } from '@/modules/governance/AccountDetail'
import LiquidityGauge from '@/modules/governance/LiquidityGauge'
import { ProposalDetailCard } from '@/modules/governance/ProposalDetailCard'
import { EMISSION_ROUNDING_MODE, latestSnapshotIpfsData } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
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
import { Trans } from '@lingui/macro'

export const ProposalDetail = ({ proposalDetail }) => {
  const [selectedChains, setSelectedChains] = useState([])

  const isValidProposal = getTagFromTitle(proposalDetail.title) === 'gce'
  const chainIds = getChainsFromChoices(proposalDetail.choices)

  const filteredResults = getResultsByChains(getVotingResults(proposalDetail.choices, proposalDetail.scores), selectedChains)

  const emission = latestSnapshotIpfsData.emission

  const distribution = filteredResults.map(result => {
    return {
      key: result.key,
      emission: toBN(emission).multipliedBy(result.percent).decimalPlaces(0, EMISSION_ROUNDING_MODE).toString()
    }
  })

  const emissionOfSelectedChains = distribution.length === 0
    ? sumOf(...(filteredResults || []).map((r) => { return r.percent })).multipliedBy(emission).decimalPlaces(0, EMISSION_ROUNDING_MODE).toString()
    : sumOf(...distribution.map((d) => { return d.emission })).toString()

  return (
    <Container>
      <BreadCrumbs
        data-testid='breadcrumbs'
        pages={[
          {
            name: <Trans>Governance</Trans>,
            href: Routes.Governance,
            current: false
          },
          {
            name: proposalDetail.title,
            href: '#',
            current: true
          }
        ]}
      />
      <div className='flex flex-col gap-8'>
        <ProposalDetailCard
          proposalId={proposalDetail.id}
          title={proposalDetail.title}
          snapshot={proposalDetail.snapshot}
          start={proposalDetail.start}
          end={proposalDetail.end}
          state={proposalDetail.state}
          network={proposalDetail.network}
        />

        {isValidProposal
          ? (
            <LiquidityGauge
              results={filteredResults}
              selectedChains={selectedChains}
              setSelectedChains={setSelectedChains}
              chainIds={chainIds}
              emission={emissionOfSelectedChains}
              start={proposalDetail.start}
              end={proposalDetail.end}
              state={proposalDetail.state}
            />)
          : (
            <Alert className='!mt-6'>
              Invalid proposal type, please select a valid proposal to view details.
            </Alert>
            )}

        {isValidProposal && selectedChains.length === 1 && (
          <AccountDetail
            title={proposalDetail.title}
            selectedChain={selectedChains[0]}
            distribution={distribution}
          />
        )}
      </div>
    </Container>
  )
}
