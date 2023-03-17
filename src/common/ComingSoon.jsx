import Link from 'next/link'

import { Container } from '@/common/Container/Container'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export function ComingSoon () {
  const { networkId } = useNetwork()
  const { isMainNet, isArbitrum } = useValidateNetwork(networkId)

  const linkColor = isArbitrum
    ? 'border-1D9AEE bg-1D9AEE focus-visible:ring-1D9AEE'
    : isMainNet
      ? 'border-4e7dd9 bg-4e7dd9 focus-visible:ring-4e7dd9'
      : 'border-5D52DC bg-5D52DC focus-visible:ring-5D52DC'

  return (
    <div className='max-w-full bg-white' data-testid='main-container'>
      <Container className='flex flex-col items-center bg-top bg-no-repeat bg-contain py-28 sm:bg-auto bg-404-background bg-origin-content'>
        <img src='/404.svg' alt='404 page not found' />
        <p className='py-3 mt-12 mb-4 font-bold leading-10 text-center text-xxl'>
          <Trans>Coming soon!</Trans>
        </p>
        <p className='mb-11 text-md'>
          <Trans>
            Feature is yet to be released. Our team&#x2019;s getting it ready
            for you.
          </Trans>
        </p>
        <Link href={Routes.Home} replace>
          <a
            className={classNames(
              'uppercase py-5 px-16 font-bold leading-8 text-EEEEEE border  rounded-lg  focus:outline-none focus-visible:ring-2 ',
              linkColor
            )}
          >
            <Trans>Take me back to homepage</Trans>
          </a>
        </Link>
      </Container>
    </div>
  )
}
