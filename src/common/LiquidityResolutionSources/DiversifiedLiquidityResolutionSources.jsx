import { useRouter } from 'next/router'

import { SecondaryCard } from '@/common/SecondaryCard/SecondaryCard'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { explainInterval } from '@/utils/formatter/interval'

export const DiversifiedLiquidityResolutionSources = ({ coverData, children }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const totalLiquidity = coverData.tvl
  const reassuranceAmount = coverData.reassurance
  const reportingPeriod = coverData.reportingPeriod

  return (
    <div className='col-span-3 row-start-2 md:col-auto md:row-start-auto'>
      <SecondaryCard>
        <div className='flex flex-wrap justify-between md:block'>
          <div>
            <h3 className='text-lg font-semibold'>
              Vault Info
            </h3>
            <p className='mt-1 mb-6 text-sm opacity-50'>
              {explainInterval(reportingPeriod)} Reporting Period
            </p>
          </div>
        </div>

        <div
          className='flex justify-between pb-2'
          title={
            formatCurrency(
              convertFromUnits(totalLiquidity, liquidityTokenDecimals),
              router.locale
            ).long
          }
        >
          <span className=''>
            Total Liquidity:
          </span>
          <strong className='font-bold text-right'>
            {
              formatCurrency(
                convertFromUnits(totalLiquidity, liquidityTokenDecimals),
                router.locale
              ).short
            }
          </strong>
        </div>
        <div
          className='flex justify-between'
          title={
            formatCurrency(
              convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
              router.locale
            ).long
          }
        >
          <span className=''>
            Reassurance:
          </span>
          <strong className='font-bold text-right'>
            {
              formatCurrency(
                convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
                router.locale
              ).short
            }
          </strong>
        </div>

        {children}
      </SecondaryCard>
    </div>
  )
}
