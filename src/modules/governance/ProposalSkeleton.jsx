import { Container } from '@/common/Container/Container'
import { Skeleton } from '@/common/Skeleton/Skeleton'
import GovernanceCard from '@/modules/governance/GovernanceCard'

const ProposalSkeleton = () => {
  return (
    <Container>
      <div className='flex flex-col gap-8'>
        <GovernanceCard className='p-8'>
          <Skeleton className='h-5 rounded-full max-w-60' />
          <div className='flex flex-row gap-2 my-6'>
            <Skeleton className='w-6 h-3.5 rounded-full' />
            <Skeleton className='w-6 h-3.5 rounded-full' />
          </div>
          <Skeleton className='flex h-20 rounded-2' />
        </GovernanceCard>

        <GovernanceCard className='p-8'>
          <div className='flex items-center justify-between'>
            <Skeleton className='w-40 h-12 rounded-2' />
            <Skeleton className='h-3 rounded-full w-28' />
          </div>
          <Skeleton className='mx-auto mt-6 rounded-full w-80 h-80' />
        </GovernanceCard>

        <GovernanceCard className='p-8'>
          <Skeleton className='flex h-20 rounded-2' />
        </GovernanceCard>
      </div>
    </Container>
  )
}

export default ProposalSkeleton
