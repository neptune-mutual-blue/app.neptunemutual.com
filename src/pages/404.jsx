import { Container } from '@/common/Container/Container'
import { Routes } from '@/src/config/routes'
import { logPageLoad } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'
import { useWeb3React } from '@web3-react/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'

export default function PageNotFound () {
  const router = useRouter()
  const { account, chainId } = useWeb3React()
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  analyticsLogger(() => logPageLoad(chainId, account ?? null, router.asPath))

  return (
    <Container className='max-w-full flex flex-col items-center justify-end bg-bottom bg-cover bg-no-repeat bg-404 bg-white min-h-vh-content bg-origin-content md:px-0'>
      <p className='mb-11 text-h5 text-404040'>
        Oops! Looks like you&#x2019;re heading to a wrong planet.
      </p>
      <Link href={Routes.Home} replace>
        <a
          className={classNames(
            'px-16 py-5 font-bold leading-8 tracking-wide uppercase border rounded-lg text-EEEEEE focus:outline-none focus-visible:ring-2 mb-24',
            isMainNet ? 'border-4e7dd9 bg-4e7dd9 focus-visible:ring-4e7dd9' : 'border-5D52DC bg-5D52DC focus-visible:ring-5D52DC'
          )}
        >
          Take me back to homepage
        </a>
      </Link>
    </Container>
  )
}
