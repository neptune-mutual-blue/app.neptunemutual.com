import React from 'react'

import { Trans } from '@lingui/macro'

export const StandardsTerms = ({ className = '' }) => {
  return (
    <div className={className}>
      <h2 className='text-000000 text-h1'>Standard Terms and Conditions</h2>
      <p className='m-2'>
        <Trans>
          <a className='underline text-4e7dd9' href='https://docs.neptunemutual.com/usage/standard-terms-and-conditions' target='_blank' rel='noreferrer'>
            Latest version
          </a> of the Standard Terms and Conditions will apply.
        </Trans>

      </p>

    </div>
  )
}
