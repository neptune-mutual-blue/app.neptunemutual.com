import React from 'react'

import { Trans } from '@lingui/macro'

export const StandardsTerms = ({ className = '' }) => {
  return (
    <div className={className}>
      <h2 className='text-000000 text-para font-bold sm:font-normal sm:text-h1'>Standard Terms and Conditions</h2>
      <p className='sm:mt-2'>
        <Trans>
          Latest version of the Standard Terms and Conditions will apply.
        </Trans>
      </p>
      <a className='underline text-para sm:text-lg mt-4 block' href='https://docs.neptunemutual.com/usage/standard-terms-and-conditions' target='_blank' rel='noreferrer'>
        https://docs.neptunemutual.com/usage/standard-terms-and-conditions
      </a>
    </div>
  )
}
