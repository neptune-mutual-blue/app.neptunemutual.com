import { Alert } from '@/common/Alert/Alert'
import { RegularButton } from '@/common/Button/RegularButton'
import { E_CARD_STATUS, identifyStatus, Badge } from '@/common/CardStatusBadge'
import { CoverAvatar } from '@/common/CoverAvatar'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { Routes } from '@/src/config/routes'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const AbnormalCoverStatus = ({
  status,
  coverKey,
  productKey,
  activeIncidentDate,
  imgSrc,
  name,
  className = ''
}) => {
  const router = useRouter()

  const href = Routes.ViewReport(coverKey, productKey, activeIncidentDate)
  const statusLink = (
    <Link href={href}>
      <a className='font-medium underline hover:no-underline'>
        {status}
      </a>
    </Link>
  )

  const badgeStatus = E_CARD_STATUS[identifyStatus(status)]

  return (
    <OutlinedCard className={classNames('p-8 bg-white max-w-466', className)}>
      <div className='flex gap-4'>
        <CoverAvatar
          imgs={[{ src: imgSrc, alt: name }]}
          containerClass='flex-grow-0'
        />

        <div>
          <h2 className='text-xl font-semibold'>{name}</h2>
          <Badge icon className='mt-1 flex items-center gap-1 px-2 py-0.5 text-xs w-max rounded-1' status={badgeStatus} />
        </div>
      </div>

      <Alert>
        <Trans>
          Cannot purchase policy, since the cover is under {statusLink}
        </Trans>
      </Alert>

      <RegularButton
        className='w-full p-4 mt-8 uppercase rounded-big'
        onClick={() => router.push(href)}
      >
        View Reporting
      </RegularButton>
    </OutlinedCard>
  )
}
