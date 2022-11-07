import { Checkbox } from '@/common/Checkbox/Checkbox'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { Alert } from '@/common/Alert/Alert'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'

import LeftArrow from '@/icons/LeftArrow'
import { Routes } from '@/src/config/routes'
import { config } from '@neptunemutual/sdk'
import { log } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { useWeb3React } from '@web3-react/core'

export const AcceptRulesForm = ({
  onAccept,
  children,
  coverKey,
  productKey = config.constants.ZERO_BYTES32
}) => {
  const router = useRouter()
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)
  const coverPurchasePage = router.pathname.includes('purchase')
  const [checked, setChecked] = useState(false)
  const { activeIncidentDate, productStatus } = useCoverStatsContext()
  const { account, chainId } = useWeb3React()

  const handleLog = (sequence, step, event) => {
    const isLiquidityPage = router.pathname.includes('add-liquidity')
    const isPurchasePage = router.pathname.includes('purchase')

    let funnel, journey

    if (isLiquidityPage) {
      funnel = 'Provide Liquidity'
      journey = 'provide-liquidity-page'
    }

    if (isPurchasePage) {
      funnel = 'Purchase Policy'
      journey = 'pre-purchase-policy-page'
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event)
    })
  }

  const handleChange = (ev) => {
    setChecked(ev.target.checked)
    if (coverPurchasePage) {
      analyticsLogger(() => log(chainId, 'Purchase Policy', 'pre-purchase-policy-page', 'acknowledgement-checkbox', 1, account, 'click'))
    }

    const isLiquidityPage = router.pathname.includes('add-liquidity')
    const checked = ev.target.checked

    if (isLiquidityPage && checked) {
      handleLog(1, 'acknowledgement-checkbox', 'click')
    }
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    if (checked) {
      onAccept()

      handleLog(2, 'next-button', 'click')
      handleLog(9999, 'end', 'closed')
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
            isMainNet ? 'bg-4e7dd9' : 'bg-5D52DC',
            'flex items-center text-EEEEEE py-3 px-4 mt-8 rounded-big w-full sm:w-auto justify-center'
          )}
        >
          <Trans>Next</Trans>

          <LeftArrow variant='right' />
        </button>
      </form>
    </>
  )
}
