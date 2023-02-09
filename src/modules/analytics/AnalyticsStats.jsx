import { StatsCard } from "@/src/modules/analytics/StatsCard"
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits, toBN } from '@/utils/bn'
import { useRouter } from 'next/router'
import { useProtocolDayData } from '@/src/hooks/useProtocolDayData'
import { useAppConstants } from '@/src/context/AppConstants'
import { useFetchHeroStats } from '@/src/hooks/useFetchHeroStats'

export const AnalyticsStats = () => {
  const router = useRouter()
  const { poolsTvl, liquidityTokenDecimals } = useAppConstants()
  const { data } = useProtocolDayData()
  const currentCapacity = (data && data.length > 0) ? data[data.length - 1].totalCapacity : '0'
  const { data: heroData } = useFetchHeroStats()

  return (
    <div className='flex items-start justify-between pb-16 '>
      <StatsCard title='Total Capacity' value={
        formatCurrency(
            convertFromUnits(
              currentCapacity,
              liquidityTokenDecimals
            ).toString(),
            router.locale
          ).short
        } 
      />
      <StatsCard title='Covered' value={
        formatCurrency(
          convertFromUnits(
            heroData.covered,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      } />
      <StatsCard title='Commitment' value='$70.0M' />
      <StatsCard title='Cover Fee' value={
        formatCurrency(
          convertFromUnits(
            heroData.coverFee,
            liquidityTokenDecimals
          ).toString(),
          router.locale
        ).short
      } />
    </div>
  );
}