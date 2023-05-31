import { ProposalsTable } from '@/modules/governance/proposals-table/ProposalsTable'
import { ViewProposals } from '@/modules/governance/view-proposals/ViewProposals'

export const GovernanceModule = () => {
  return (
    <>
      <ViewProposals />
      <ProposalsTable />
    </>
  )
}
