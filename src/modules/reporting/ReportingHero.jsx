import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { t } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

export const ReportingHero = ({ coverKey, productKey, coverInfo, reportStatus = null }) => {
  const router = useRouter()
  const isDiversified = isValidProduct(productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  const breadcrumbData = reportStatus
    ? [
        { name: t`Home`, href: '/', current: false },
        {
          name: t`Reporting`,
          href: reportStatus.resolved
            ? Routes.ResolvedReports
            : Routes.ActiveReports,
          current: false
        },
        {
          name: isDiversified
            ? coverInfo?.infoObj.productName
            : coverInfo?.infoObj.coverName,
          current: !reportStatus.dispute,
          href: reportStatus.dispute
            ? router.asPath.replace('/dispute', '/details')
            : ''
        }
      ]
    : [
        { name: t`Home`, href: '/', current: false },
        {
          name: isDiversified
            ? coverInfo?.infoObj.productName
            : coverInfo?.infoObj.coverName,
          href: isDiversified
            ? Routes.ViewProduct(coverKey, productKey)
            : Routes.ViewCover(coverKey),
          current: false
        },
        { name: t`Reporting`, current: true }
      ]

  if (reportStatus?.dispute) {
    breadcrumbData.push({
      name: 'Dispute',
      current: true
    })
  }

  return (
    <Hero>
      <Container className='px-2 py-20 min-h-[312px]'>
        <BreadCrumbs pages={breadcrumbData} />
        <div className='flex'>
          <CoverProfileInfo
            coverKey={coverKey}
            productKey={productKey}
            imgSrc={imgSrc}
            links={coverInfo?.infoObj.links}
            projectName={
              isDiversified
                ? coverInfo?.infoObj.productName
                : coverInfo?.infoObj.coverName
            }
          />
        </div>
      </Container>
    </Hero>
  )
}
