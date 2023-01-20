import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import Head from 'next/head'

export const Seo = ({
  title = 'Neptune Mutual Covers',
  description = 'Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
}) => {
  const { networkId } = useNetwork()
  const { isTestNet } = useValidateNetwork(networkId)

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      {isTestNet && <meta name='robots' content='noindex,nofollow' />}
    </Head>
  )
}
