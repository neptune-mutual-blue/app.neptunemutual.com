import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Trans } from '@lingui/macro'

export const CoverPurchaseDetailsPage = () => {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { coverInfo, loading } = useCoverOrProductData({ coverKey, productKey })

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }
  if (!loading && !coverInfo) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  return (
    <main>
      <div className='pt-12 pb-24 border-t border-t-B0C4DB' data-testid='body'>
        <Container className='flex justify-center'>
          <div className='w-full md:w-2/3'>
            <div className='flex justify-center w-full mt-12'>
              <PurchasePolicyForm
                coverKey={coverKey}
                productKey={productKey}
                coverInfo={coverInfo}
              />
            </div>
          </div>
        </Container>
      </div>
    </main>
  )
}
