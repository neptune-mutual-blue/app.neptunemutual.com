import { useWeb3React } from '@web3-react/core'

const { InfoTooltip } = require('@/common/Cover/InfoTooltip')
const { default: InfoCircleIcon } = require('@/icons/InfoCircleIcon')
const { formatCurrency } = require('@/utils/formatter/currency')
const { formatPercent } = require('@/utils/formatter/percent')
const { useRouter } = require('next/router')

export const LiquidityGaugeBoostDetails = ({ tokenValue, boost, apr }) => {
  const router = useRouter()
  const { active } = useWeb3React()

  const BoostButton = ({ className = '', value }) => {
    return (
      <>
        {!active
          ? (
            <InfoTooltip infoComponent='Please connect your wallet to view your boost.' className='text-[11px] px-2 py-0.75 bg-opacity-100 max-w-none' disabled={active}>
              <button type='button' className={`rounded-full text-white text-sm font-semibold px-[11px] py-1 ${className}`}>
                Boost: ?
              </button>
            </InfoTooltip>
            )
          : (
            <div className={`rounded-full text-white text-sm font-semibold px-[11px] py-1 ${className}`}>
              Boost: {value}x
            </div>
            )}
      </>
    )
  }

  const checkBoost = (value) => {
    const number = Math.floor(value)

    switch (true) {
      case number <= 2:
        return <BoostButton value={value} className='bg-[#5D6B98]' />
      case number > 2 && number < 4:
        return <BoostButton value={value} className='bg-[#363F72]' />
      case number >= 4:
        return <BoostButton value={value} className='bg-[#101323]' />
      default:
        return null
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row items-center gap-1'>
        <h2 className='text-lg font-semibold text-01052D'>{formatCurrency(tokenValue, router.locale, '', true, true).short} NPM/M</h2>
        <InfoTooltip infoComponent={`${formatCurrency(tokenValue, router.locale, '', true, true).long} NPM emission per block.`} className='text-[11px] px-2 py-0.75 bg-opacity-100 max-w-none' align='end'>
          <button type='button' className='cursor-default'><InfoCircleIcon className='w-4 h-4' /></button>
        </InfoTooltip>
      </div>
      <div className='inline-flex justify-end'>
        {checkBoost(boost)}
      </div>
      <div className='inline-flex justify-end'>
        <div className='text-sm font-semibold rounded-full text-21AD8C border-[1px] border-21AD8C px-[11px] py-1'>
          APR: {formatPercent(apr)}
        </div>
      </div>
    </div>
  )
}
