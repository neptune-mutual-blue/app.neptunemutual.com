import { Badge, identifyStatus } from '@/common/CardStatusBadge'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { SocialIconLinks } from '@/common/CoverProfileInfo/SocialIconLinks'
import { Routes } from '@/src/config/routes'
import { isGreater } from '@/utils/bn'
import Link from 'next/link'
import { ProjectImage } from './ProjectImage'
import { ProjectName } from './ProjectName'
import { ProjectWebsiteLink } from './ProjectWebsiteLink'

/**
 *
 * @param {object} param
 * @param {string} param.status
 * @param {string} [param.incidentDate]
 * @param {string} [param.coverKey]
 * @param {string} [param.productKey]
 * @returns
 */
export function Card ({ status, incidentDate = '0', coverKey, productKey }) {
  const badge = (
    <Badge
      status={status}
      className='flex items-center rounded-1 py-0.5 px-1.5 leading-4.5 text-white'
      icon
      data-testid='projectstatusindicator-container'
    />
  )

  if (isGreater(incidentDate, '0')) {
    return (
      <Link href={Routes.ViewReport(coverKey, productKey, incidentDate)}>
        <a data-testid='badge-link'>{badge}</a>
      </Link>
    )
  }

  return badge
}

export const CoverProfileInfo = ({
  imgSrc,
  projectName,
  links,
  coverKey,
  productKey
}) => {
  const { productStatus, activeIncidentDate } = useCoverStatsContext()

  return (
    <div className='flex' data-testid='dedicated-coverprofileinfo-container'>
      <div>
        <ProjectImage imgSrc={imgSrc} name={projectName} />
      </div>
      <div className='p-3' />
      <div>
        <div className='flex flex-wrap-reverse items-center gap-x-4 gap-y-1'>
          <ProjectName name={projectName} />
          <Card
            coverKey={coverKey}
            productKey={productKey}
            status={identifyStatus(productStatus)}
            incidentDate={activeIncidentDate}
          />
        </div>
        <ProjectWebsiteLink website={links?.website} />
        <SocialIconLinks links={links} />
      </div>
    </div>
  )
}
