
import { Trans } from '@lingui/macro'

export const StandardsTerms = ({ className = '' }) => {
  return (
    <div className={className}>
      <h2 className='text-000000 text-md font-bold sm:text-lg'>Standard Terms and Conditions</h2>
      <p className='text-md leading-6 sm:text-lg sm:mt-2'>
        <Trans>
          Latest version of the Standard Terms and Conditions will apply.
        </Trans>
      </p>
      <a className='underline text-md sm:text-lg mt-4 block break-all' href='https://docs.neptunemutual.com/usage/standard-terms-and-conditions' target='_blank' rel='noreferrer'>
        https://docs.neptunemutual.com/usage/standard-terms-and-conditions
      </a>
    </div>
  )
}
