import { useRouter } from 'next/router'

import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import {
  t,
  Trans
} from '@lingui/macro'
import { PurchasePageSkeleton } from '@/modules/cover/purchase/PurchasePageSkeleton'

export const CoverPurchaseDetailsPage = () => {
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const isDiversified = isValidProduct(productKey)
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  const getBreadCrumbs = (
    isDiversified,
    coverOrProductData,
    coverKey,
    productKey
  ) => {
    if (isDiversified) {
      return [
        { name: t`Home`, href: '/', current: false },
        {
          name: coverOrProductData?.coverInfoDetails?.coverName || t`loading...`,
          href: Routes.ViewCover(coverKey),
          current: true
        },
        {
          name: coverOrProductData?.productInfoDetails?.productName || t`loading...`,
          href: Routes.ViewProduct(coverKey, productKey),
          current: true
        },
        {
          name: t`Purchase Policy`,
          current: true
        }
      ]
    }

    return [
      { name: t`Home`, href: '/', current: false },
      {
        name: coverOrProductData?.coverInfoDetails?.coverName || t`loading...`,
        href: Routes.ViewCover(coverKey),
        current: true
      },
      {
        name: t`Purchase Policy`,
        current: true
      }
    ]
  }

  if (loading) {
    return (
      <PurchasePageSkeleton data-testid='purchase-policy-skeleton' />
    )
  }
  if (!coverOrProductData) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const parameters = isDiversified ? coverOrProductData?.productInfoDetails?.parameters : coverOrProductData?.coverInfoDetails?.parameters

  return (
    <main>
      <Container className='pt-5 md:pt-9'>
        <BreadCrumbs
          pages={getBreadCrumbs(
            isDiversified,
            coverOrProductData,
            coverKey,
            productKey
          )}
          data-testid='cover-purchase-breadcrumb'
        />
      </Container>

      <div className='pt-12 pb-24' data-testid='body'>
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
