import { Container } from '@/common/Container/Container'
import Link from 'next/link'
import { Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'

export function ComingSoon () {
  return (
    <div className='max-w-full bg-white' data-testid='main-container'>
      <Container className='flex flex-col items-center bg-top bg-no-repeat bg-contain py-28 sm:bg-auto bg-404-background bg-origin-content'>
        <img src='/404.svg' alt='404 page not found' />
        <p className='py-3 mt-12 mb-4 font-bold leading-10 text-center font-sora text-xxl'>
          <Trans>Coming soon!</Trans>
        </p>
        <p className='mb-11 text-h5'>
          <Trans>
            Feature is yet to be released. Our team&#x2019;s getting it ready
            for you.
          </Trans>
        </p>
        <Link href={Routes.Home} replace>
          <a
            className='uppercase py-5 px-16 font-bold leading-8 tracking-wide text-EEEEEE border border-4e7dd9 rounded-lg bg-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
          >
            <Trans>Take me back to homepage</Trans>
          </a>
        </Link>
      </Container>
    </div>
  )
}
