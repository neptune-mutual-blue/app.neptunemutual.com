import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import Head from 'next/head'

const ogtitle = 'Neptune Mutual Decentralized Insurance'
const ogdescription = 'Neptune Mutual protects the Ethereum community from hacks and exploits through its unique parametric DeFi insurance marketplace designed to cover, protect and secure onchain digital assets; power by Ethereum, driven by stablecoins.'

export const Seo = ({
  title = 'Neptune Mutual Covers',
  description = 'Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
}) => {
  const { networkId } = useNetwork()
  const { isTestNet, isEthereum, isArbitrum } = useValidateNetwork(networkId)

  let opImageUri = 'https://app.neptunemutual.net/images/og.png'

  if (isEthereum) {
    opImageUri = 'https://app.neptunemutual.net/images/neptune-mutual-arbitrum-marketplace-open-graph-image.png'
  }
  if (isArbitrum) {
    opImageUri = 'https://app.neptunemutual.net/images/neptune-mutual-ethereum-marketplace-open-graph-image.png'
  }

  return (
    <Head>
      <title>{title}</title>
      {isTestNet && <meta name='robots' content='noindex,nofollow' />}
      <meta name='description' content={description} />

      <meta property='og:type' content='website' />
      <meta property='og:title' content={ogtitle} />
      <meta property='og:description' content={ogdescription} />
      <meta property='og:image' content={opImageUri} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={ogtitle} />
      <meta name='twitter:description' content={ogdescription} />
      <meta name='twitter:image' content={opImageUri} />
    </Head>
  )
}
