
import { useRouter } from 'next/router'

import { NoDataFound } from '@/common/Loading'
import ProposalSkeleton from '@/modules/governance/ProposalSkeleton'
import { useSnapshotProposalById } from '@/src/hooks/useSnapshotProposalById'

import { ProposalDetail } from '@/modules/governance/ProposalDetail'

export const GovernanceSinglePage = () => {
  const router = useRouter()
  const { proposalId } = router.query

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
