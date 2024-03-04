import { NoDataFound } from '@/common/Loading'
import { ProposalDetail } from '@/modules/governance/ProposalDetail'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { useSnapshotProposalById } from '@/src/hooks/useSnapshotProposalById'

export const GovernanceSinglePage = ({ proposalId }) => {
  const { data: proposalDetail, loading } = useSnapshotProposalById(proposalId)

  if (loading) {
    return <ProposalSkeleton />
  }

  if (!proposalDetail) {
    return (
      <NoDataFound />
    )
  }

  return <ProposalDetail proposalDetail={proposalDetail} />
}
