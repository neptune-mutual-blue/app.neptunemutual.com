import { useRouter } from 'next/router'

import { Container } from '@/common/Container/Container'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Trans } from '@lingui/macro'

export const CoverPurchaseDetailsPage = () => {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const isDiversified = isValidProduct(productKey)
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const parameters = isDiversified ? coverOrProductData?.productInfoDetails?.parameters : coverOrProductData?.coverInfoDetails?.parameters

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }
  if (!coverOrProductData) {
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
                availableForUnderwriting={coverOrProductData?.availableForUnderwriting}
                isUserWhitelisted={coverOrProductData?.isUserWhitelisted}
                requiresWhitelist={coverOrProductData?.requiresWhitelist}
                activeIncidentDate={coverOrProductData?.activeIncidentDate}
                productStatus={coverOrProductData?.productStatus}
                coverageLag={coverOrProductData?.coverageLag}
                projectOrProductName={projectOrProductName}
                parameters={parameters}
              />
            </div>
          </div>
        </Container>
      </div>
    </main>
  )
}
