import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { Hero } from '@/common/Hero'
import { CoverStatus } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { Trans } from '@lingui/macro'

export const ReportingHero = ({
  coverKey,
  productKey,
  coverOrProductData,
  incidentDate = null,
  type = '',
  isResolved = false,
  projectOrProductName
}) => {
  const isDiversified = isValidProduct(productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })
  const coverName = coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const productName = coverOrProductData?.productInfoDetails?.productName
  const socialLinks = isDiversified ? coverOrProductData?.productInfoDetails.links : coverOrProductData?.coverInfoDetails.links

  const productStatus = CoverStatus[coverOrProductData.productStatus]
  const activeIncidentDate = coverOrProductData.activeIncidentDate

  let breadcrumbData = []

  breadcrumbData = [
    { name: <Trans>Home</Trans>, href: '/' },
    { name: coverName, href: Routes.ViewCover(coverKey) },
    isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
    { name: <Trans>Reporting</Trans>, href: '' }
  ].filter(Boolean)

  if (type === 'new-report') {
    breadcrumbData = [
      { name: <Trans>Home</Trans>, href: '/' },
      { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
      { name: <Trans>Reporting</Trans>, href: '' }
    ].filter(Boolean)
  }

  if (type === 'details') {
    breadcrumbData = [
      { name: <Trans>Home</Trans>, href: '/' },
      { name: <Trans>Reporting</Trans>, href: isResolved ? Routes.ResolvedReports : Routes.ActiveReports },
      !isDiversified && { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) }
    ].filter(Boolean)
  }

  if (type === 'new-dispute') {
    breadcrumbData = [
      { name: <Trans>Home</Trans>, href: '/' },
      !isDiversified && { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
      { name: <Trans>Reporting</Trans>, href: Routes.ViewReport(coverKey, productKey, incidentDate) },
      { name: <Trans>Dispute</Trans>, href: '' }
    ].filter(Boolean)
  }

  breadcrumbData = breadcrumbData.map((breadcrumb, i, arr) => {
    return (i === arr.length - 1)
      ? { ...breadcrumb, current: true }
      : { ...breadcrumb, current: false }
  })

  return (
    <Hero>
      <Container className='px-2 pt-5 pb-20 md:py-20 min-h-[312px]'>
        <BreadCrumbs pages={breadcrumbData} />
        <div className='flex'>
          <CoverProfileInfo
            coverKey={coverKey}
            productKey={productKey}
            imgSrc={imgSrc}
            links={socialLinks}
            projectName={projectOrProductName}
            productStatus={productStatus}
            activeIncidentDate={activeIncidentDate}
          />
        </div>
      </Container>
    </Hero>
  )
}
