import {
  LiquidityGaugeBalanceDetails
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeBalanceDetails'
import {
  LiquidityGaugeBoostDetails
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeBoostDetails'
import {
  LiquidityGaugeCardAction
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import {
  LiquidityGaugeCardHeading
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardHeading'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'

export const LiquidityGaugePoolsCard = ({ data }) => {
  const { active } = useWeb3React()

  const DescriptionOrDetail = ({
    lock,
    description,
    balance,
    subtitle,
    emissionReceived,
    lockupPeriod,
    tvl,
    mobile = false
  }) => (
    <div className={classNames(mobile && 'md:hidden', !mobile && 'hidden md:block')}>
      {lock || !active
        ? <p className='max-w-xl mt-6 font-normal text-999BAB md:mt-0'>{description}</p>
        : <LiquidityGaugeBalanceDetails
            balance={balance}
            token={subtitle}
            emissionReceived={emissionReceived}
            lockupPeriod={lockupPeriod}
            tvl={tvl}
          />}
    </div>
  )

  return (
    <div role='list' className='divide-y divide-B0C4DB border-[1px] border-B0C4DB rounded-2xl'>
      {data.map((liquidityGaugeData) =>
        <div className='p-8 bg-white first:rounded-t-2xl last:rounded-b-2xl' key={liquidityGaugeData.id}>
          <div className='flex flex-col md:gap-10'>
            <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] items-start justify-between'>
              <div className='flex flex-col gap-4'>
                <LiquidityGaugeCardHeading
                  title={liquidityGaugeData.title}
                  subtitle={liquidityGaugeData.subtitle}
                  icons={liquidityGaugeData.icons}
                  stake={liquidityGaugeData.stake}
                />

                <DescriptionOrDetail
                  lock={liquidityGaugeData.lock}
                  balance={liquidityGaugeData.balance}
                  description={liquidityGaugeData.description}
                  subtitle={liquidityGaugeData.subtitle}
                  tvl={liquidityGaugeData.tvl}
                  emissionReceived={liquidityGaugeData.emission_received}
                  lockupPeriod={liquidityGaugeData.lockup_period}
                />
              </div>

              <LiquidityGaugeBoostDetails
                tokenValue={liquidityGaugeData.npm}
                boost={liquidityGaugeData.boost}
                apr={liquidityGaugeData.APR}
              />
            </div>

            <DescriptionOrDetail
              lock={liquidityGaugeData.lock}
              balance={liquidityGaugeData.balance}
              description={liquidityGaugeData.description}
              subtitle={liquidityGaugeData.subtitle}
              tvl={liquidityGaugeData.tvl}
              emissionReceived={liquidityGaugeData.emission_received}
              lockupPeriod={liquidityGaugeData.lockup_period}
              mobile
            />

            <LiquidityGaugeCardAction
              lockupPeriod={liquidityGaugeData.lockup_period}
              tokenName={liquidityGaugeData.reward_token.name}
              tokenIcon={liquidityGaugeData.reward_token.icon}
              isLock={liquidityGaugeData.lock}
              subTitle={liquidityGaugeData.subtitle}
              balance={liquidityGaugeData.balance}
              token={liquidityGaugeData.subtitle}
              emissionReceived={liquidityGaugeData.emission_received}
            />
          </div>
        </div>
      )}
    </div>
  )
}
