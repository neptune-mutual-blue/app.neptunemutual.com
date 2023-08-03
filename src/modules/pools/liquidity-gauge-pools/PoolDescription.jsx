import { toBN } from '@/utils/bn'
import { classNames } from '@/utils/classnames'

export function PoolDescription ({
  description = '', stakedBalance, mobile = false
}) {
  if (!toBN(stakedBalance).isZero()) {
    return null
  }

  return (
    <div className={classNames(mobile && 'md:hidden', !mobile && 'hidden md:block')}>
      <p className='max-w-xl mt-6 font-normal text-999BAB md:mt-0'>
        {description}
      </p>
    </div>
  )
}
