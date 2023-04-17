import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { SwapAddLiquidity } from '@/modules/swap/add-liquidity'

export default function Home () {
  return (
    <main>
      <Seo />
      <Container className='pt-16 pb-80'>
        <SwapAddLiquidity />
      </Container>

    </main>
  )
}
