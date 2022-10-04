import { Label } from '@/common/Label/Label'
import { Trans } from '@lingui/macro'

export const UnlockDate = ({ title, value }) => {
  return (
    <>
      <Label htmlFor='unlock-date' className='mb-1 font-semibold uppercase'>
        <Trans>Unlock Date</Trans>
      </Label>
      <div>
        <span
          id='unlock-date'
          className='text-7398C0'
          title={title}
          data-testid='detail-span'
        >
          {value}
        </span>
      </div>
    </>
  )
}
