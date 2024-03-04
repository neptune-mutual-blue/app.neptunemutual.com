import {
  ProposalsTable
} from '@/modules/governance/proposals-table/ProposalsTable'
import {
  ViewProposals
} from '@/modules/governance/view-proposals/ViewProposals'
import { useNetwork } from '@/src/context/Network'

export const GovernanceModule = () => {
  const { networkId } = useNetwork()

  return (
    <>
      <ViewProposals networkId={networkId} />
      <ProposalsTable />
    </>
  )
}
