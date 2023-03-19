import { BackButton } from '@/common/BackButton/BackButton'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { OptionActionCard } from '@/common/Option/OptionActionCard'
import { actions as coverActions } from '@/src/config/cover/actions'
import { Routes } from '@/src/config/routes'
import { log } from '@/src/services/logs'
import { classNames } from '@/utils/classnames'
import { analyticsLogger } from '@/utils/logger'
import {
  renderDescriptionTranslation, renderTitleTranslation
} from '@/utils/translations'
import { t, Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
      }
    ]
  }
  return [
    { name: t`Home`, href: '/', current: false },
    {
      name: coverOrProductData?.coverInfoDetails?.coverName || t`loading...`,
      href: Routes.ViewCover(coverKey),
      current: true
    }
  ]
}

export const CoverOptionsPage = ({
  coverOrProductData,
  coverKey,
  productKey,
  isDiversified
}) => {
  const router = useRouter()
  const { account, chainId } = useWeb3React()

  const handleLog = action => {
    let funnel = ''
    let step = ''
    switch (action) {
      case 'add-liquidity':
        funnel = 'Provide Liquidity'
        step = 'provide-liquidity-button'
        break

      case 'purchase':
        funnel = 'Purchase Policy'
        step = 'purchase-policy-button'
        break

      case 'report':
        funnel = 'Report an Incident'
        step = 'report-incident-button'
        break

      case 'claim':
        funnel = 'Claim Cover'
        step = 'claim-cover-button'
        break

      default:
        funnel = 'Funnel'
        step = 'Step'
        break
    }

    const event = 'click'
    const journey = 'i-want-to-page'
    const coverName = router.query.coverId
    const productId = router.query.productId
    const sequence = 0
    const eventProperties = {
      coverName,
      coverKey
    }

    if (productId) {
      eventProperties.productName = productId
      eventProperties.productKey = productKey
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, eventProperties)
    })
  }

  return (
    <>
      <Container className='pt-9'>
        <BreadCrumbs
          pages={getBreadCrumbs(
            isDiversified,
            coverOrProductData,
            coverKey,
            productKey
          )}
        />
      </Container>

      <div className='min-h-screen py-6 md:px-2 lg:px-8 pt-7 lg:pt-28'>
        <Container className='pb-16'>
          <h2 className='mb-4 font-bold text-center text-h4 md:text-h3 lg:text-h2 font-sora md:mb-6 lg:mb-12'>
            <Trans>I Want to</Trans>
          </h2>
          <div className='container grid grid-cols-2 gap-4 mx-auto mb-6 justify-items-center lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 md:mb-8 lg:mb-14'>
            {Object.keys(coverActions).map((actionKey) => {
              return (
                <Link
                  key={actionKey}
                  href={coverActions[actionKey].getHref(coverKey, productKey)}
                  data-testid='cover-option-actions'
                  className={classNames(
                    'rounded-2xl md:rounded-3xl group py-10 md:py-12 h-full w-full transition duration-300 ease-out',
                    'hover:border-B0C4DB hover:ease-in hover:border-0.5 hover:border-solid  hover:shadow-option  hover:box-border hover:rounded-3xl  hover:bg-white',
                    'focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
                    'border-B0C4DB border-0.5 box-border bg-white lg:bg-transparent lg:border-none'
                  )}
                  onClick={() => handleLog(actionKey)}
                >

                  <OptionActionCard
                    title={renderTitleTranslation(
                      coverActions[actionKey].title
                    )}
                    description={renderDescriptionTranslation(
                      coverActions[actionKey].description
                    )}
                    imgSrc={coverActions[actionKey].imgSrc}
                  />

                </Link>
              )
            })}
          </div>
          <div className='flex justify-center'>
            <BackButton onClick={() => router.back()} />
          </div>
        </Container>
      </div>
    </>
  )
}
