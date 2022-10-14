import Head from 'next/head'

import HomePage from '@/modules/home'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { logPageLoad } from '@/src/services/logs'

export default function Home () {
  const { account } = useWeb3React()
  const router = useRouter()

  logPageLoad(account ?? null, router.pathname)

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      <HomePage />
    </main>
  )
}
