import Link from 'next/link'

import { GaugeChartSemiCircle } from '@/common/GaugeChart/GaugeChartSemiCircle'
import { Routes } from '@/src/config/routes'
import { toBN } from '@/utils/bn'
import {
  getBoostText,
  getBoostTextClass
} from '@/utils/calculate-boost'
import { classNames } from '@/utils/classnames'

const BOOST_MIN = 1
const BOOST_MAX = 4

export const IncreaseYourBoost = ({ boost }) => {
  const boostFraction = toBN(boost).decimalPlaces(4).toNumber()

  return (
    <div className='flex-auto max-w-[442px]'>
      <div className='flex flex-col items-center'>
        <div className='my-6'>
          <GaugeChartSemiCircle min={BOOST_MIN} max={BOOST_MAX} value={boostFraction} />
          <div className='max-w-[308px] mx-auto mt-2 text-xs font-semibold flex justify-between'>
            <div className='text-EAAA08'>Minimum</div>
            <div className='text-479E28'>Maximum</div>
          </div>
          <div className='font-semibold text-center text-md'>
            {boostFraction}
          </div>
          <div
            className={classNames(
              'text-sm font-semibold text-center',
              getBoostTextClass(boostFraction)
            )}
          >
            {getBoostText(boostFraction)}
          </div>
        </div>

        {
          (boostFraction < BOOST_MAX) && (
            (
              <Link
                href={Routes.VoteEscrow}
                className='border-primary bg-primary focus-visible:ring-primary text-EEEEEE border  tracking-2 focus:outline-none focus-visible:ring-2  flex-auto rounded-tooltip py-3 px-4 font-semibold !text-sm uppercase z-auto relative'
              >

                Increase Your Boost

              </Link>
            )
          )
        }
      </div>
    </div>
  )
}
