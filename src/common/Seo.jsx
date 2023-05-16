import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/utils/network'
import Head from 'next/head'

export const Seo = ({
  title = 'Neptune Mutual Covers',
  description = 'Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
}) => {
  const { networkId } = useNetwork()
  const { isTestNet } = getNetworkInfo(networkId)

  return (
    <Head>
      <title>{title}</title>
      {isTestNet && <meta name='robots' content='noindex,nofollow' />}
      <meta name='description' content={description} />
    </Head>
  )
}
