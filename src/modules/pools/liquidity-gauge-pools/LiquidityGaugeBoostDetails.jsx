import { useRouter } from 'next/router'

import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'

const BoostButton = ({ className = '', value }) => {
  const { active } = useWeb3React()
  return (
    <>
      {!active
        ? (
          <InfoTooltip infoComponent='Please connect your wallet to view your boost.' className='text-xs px-2 py-0.75 bg-opacity-100 max-w-none' disabled={active}>
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

  if (number <= 2) {
    return <BoostButton value={value} className='bg-[#5D6B98]' />
  }

  if (number > 2 && number < 4) {
    return <BoostButton value={value} className='bg-[#363F72]' />
  }

  if (number >= 4) {
    return <BoostButton value={value} className='bg-[#101323]' />
  }

  return null
}

export const LiquidityGaugeBoostDetails = ({ tokenValue, boost }) => {
  const router = useRouter()

  const formattedTokenValue = formatCurrency(tokenValue, router.locale, '', true, true)

  return (
    <div className='flex flex-col gap-2 mt-6 md:mt-0'>
      <div className='flex flex-row items-center gap-1'>
        <h2 className='text-lg font-semibold text-01052D'>
          {formattedTokenValue.short} NPM/Epoch
        </h2>

        <InfoTooltip infoComponent={`${formattedTokenValue.long} NPM emission per epoch.`} className='text-xs px-2 py-0.75 bg-opacity-100 max-w-none' align='end'>
          <button type='button' className='cursor-default'>
            <InfoCircleIcon className='w-4 h-4' />
          </button>
        </InfoTooltip>
      </div>

      <div className='flex flex-row gap-2 md:flex-col'>
        <div className='inline-flex justify-start md:justify-end'>
          {checkBoost(boost)}
        </div>
      </div>
    </div>
  )
}
