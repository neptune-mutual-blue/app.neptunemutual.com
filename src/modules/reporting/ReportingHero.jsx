import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { t } from '@lingui/macro'
import { Routes } from '@/src/config/routes'

export const ReportingHero = ({ coverKey, productKey, coverInfo, incidentDate = null, type = '', isResolved = false }) => {
  const isDiversified = isValidProduct(productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })
  const coverName = isDiversified
    ? coverInfo?.cover.infoObj.coverName || coverInfo?.cover.infoObj.projectName
    : coverInfo?.infoObj.coverName || coverInfo?.infoObj.projectName
  const productName = coverInfo?.infoObj.productName
  const socialLinks = coverInfo?.infoObj.links

  let breadcrumbData = []

  breadcrumbData = [
    { name: t`Home`, href: '/' },
    { name: coverName, href: Routes.ViewCover(coverKey) },
    isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
    { name: t`Reporting`, href: '' }
  ].filter(Boolean)

  if (type === 'new-report') {
    breadcrumbData = [
      { name: t`Home`, href: '/' },
      { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
      { name: t`Reporting`, href: '' }
    ].filter(Boolean)
  }

  if (type === 'details') {
    breadcrumbData = [
      { name: t`Home`, href: '/' },
      { name: t`Reporting`, href: isResolved ? Routes.ResolvedReports : Routes.ActiveReports },
      !isDiversified && { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) }
    ].filter(Boolean)
  }

  if (type === 'new-dispute') {
    breadcrumbData = [
      { name: t`Home`, href: '/' },
      !isDiversified && { name: coverName, href: Routes.ViewCover(coverKey) },
      isDiversified && { name: productName, href: Routes.ViewProduct(coverKey, productKey) },
      { name: t`Reporting`, href: Routes.ViewReport(coverKey, productKey, incidentDate) },
      { name: t`Dispute`, href: '' }
    ].filter(Boolean)
  }

  breadcrumbData = breadcrumbData.map((breadcrumb, i, arr) => {
    return (i === arr.length - 1)
      ? { ...breadcrumb, current: true }
      : { ...breadcrumb, current: false }
  })

  return (
    <Hero>
      <Container className='px-2 py-20 min-h-[312px]'>
        <BreadCrumbs pages={breadcrumbData} />
        <div className='flex'>
          <CoverProfileInfo
            coverKey={coverKey}
            productKey={productKey}
            imgSrc={imgSrc}
            links={socialLinks}
            projectName={isDiversified ? productName : coverName}
          />
        </div>
      </Container>
    </Hero>
  )
}
