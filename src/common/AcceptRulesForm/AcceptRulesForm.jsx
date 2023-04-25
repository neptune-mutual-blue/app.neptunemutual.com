import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import LeftArrow from '@/icons/LeftArrow'
import { Routes } from '@/src/config/routes'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'
import { config } from '@neptunemutual/sdk'

export const AcceptRulesForm = ({
  onAccept,
  children,
  coverKey,
  productKey = config.constants.ZERO_BYTES32,
  productStatus,
  activeIncidentDate
}) => {
  const router = useRouter()
  const coverPurchasePage = router.pathname.includes('purchase')
  const [checked, setChecked] = useState(false)

  const handleChange = (ev) => {
    setChecked(ev.target.checked)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    if (checked) {
      onAccept()
    }
  }

  if (productStatus && productStatus !== 'Normal') {
    const statusLink = (
      <Link href={Routes.ViewReport(coverKey, productKey, activeIncidentDate)}>
        <a className='font-medium underline hover:no-underline'>
          {productStatus}
        </a>
      </Link>
    )
    return (
      <Alert>
        {coverPurchasePage
          ? (
            <Trans>
              Cannot purchase policy, since the cover status is {statusLink}
            </Trans>
            )
          : (
            <Trans>
              Cannot add liquidity, since the cover status is {statusLink}
            </Trans>
            )}
      </Alert>
    )
  }

  return (
    <>
      {/* Accept Rules Form */}
      <form autoComplete='off' onSubmit={handleSubmit} className='mt-20'>
        <Checkbox
          id='checkid'
          name='checkinputname'
          checked={checked}
          onChange={handleChange}
          data-testid='accept-rules-check-box'
        >
          {children}
        </Checkbox>
        <br />
        <button
          data-testid='accept-rules-next-button'
          type='submit'
          disabled={!checked}
          className={classNames(
            checked ? 'hover:bg-opacity-80' : 'opacity-50 cursor-not-allowed',
            'flex items-center text-EEEEEE py-3 px-4 mt-8 rounded-big w-full sm:w-auto justify-center uppercase tracking-wide bg-custom-theme'
          )}
        >
          <Trans>Next</Trans>

          <LeftArrow variant='right' />
        </button>
      </form>
    </>
  )
}
