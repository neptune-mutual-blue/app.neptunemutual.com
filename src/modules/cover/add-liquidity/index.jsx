import { useState } from 'react'

import { useRouter } from 'next/router'

import { AcceptRulesForm } from '@/common/AcceptRulesForm/AcceptRulesForm'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { CoverActionsFooter } from '@/common/Cover/CoverActionsFooter'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import {
  DiversifiedCoverProfileInfo
} from '@/common/CoverProfileInfo/DiversifiedCoverProfileInfo'
import { Hero } from '@/common/Hero'
import {
  useLiquidityFormsContext
} from '@/common/LiquidityForms/LiquidityFormsContext'
import {
  ProvideLiquidityForm
} from '@/common/LiquidityForms/ProvideLiquidityForm'
import {
  LiquidityResolutionSources
} from '@/common/LiquidityResolutionSources/LiquidityResolutionSources'
import { SeeMoreParagraph } from '@/common/SeeMoreParagraph'
import {
  StandardTermsConditionsLink
} from '@/common/StandardTermsConditionsLink'
import {
  LiquiditySectionSkeleton
} from '@/modules/cover/add-liquidity/LiquiditySectionSkeleton'
import { CoveredProducts } from '@/modules/my-liquidity/content/CoveredProducts'
import { DiversifiedCoverRules } from '@/modules/my-liquidity/content/rules'
import { CoverStatus } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { classNames } from '@/utils/classnames'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { Trans } from '@lingui/macro'

export const CoverAddLiquidityDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false)
  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()
  const coverData = getCoverByCoverKey(coverKey)

  const { info, isWithdrawalWindowOpen, isWithdrawalWindowOutdated, accrueInterest, updateWithdrawalWindow } = useLiquidityFormsContext()

  if (loading) {
    return (
      <LiquiditySectionSkeleton data-testid='liquidity-section-skeleton' />
    )
  }

  if (!coverData) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const isDiversified = coverData?.supportsProducts
  const productStatus = CoverStatus[coverData.productStatus]
  const activeIncidentDate = coverData.activeIncidentDate

  const projectName = coverData?.coverInfoDetails.coverName || coverData?.coverInfoDetails.projectName
  const imgSrc = getCoverImgSrc({ key: coverKey })
  const products = isDiversified ? getProductsByCoverKey(coverKey) : []

  const handleAcceptRules = () => {
    setAcceptedRules(true)

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }

  return (
    <main>
      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: <Trans>Home</Trans>,
                href: '/',
                current: false
              },
              {
                name: coverData?.coverInfoDetails?.coverName,
                href: Routes.ViewCover(coverKey),
                current: false
              },
              { name: <Trans>Provide Liquidity</Trans>, current: true }
            ]}
          />
          <div className='flex'>
            {isDiversified
              ? (
                <DiversifiedCoverProfileInfo
                  projectName={coverData?.coverInfoDetails?.coverName}
                />
                )
              : (
                <CoverProfileInfo
                  coverKey={coverKey}
                  productKey={productKey}
                  imgSrc={imgSrc}
                  projectName={coverData?.coverInfoDetails?.coverName}
                  links={coverData?.coverInfoDetails?.links}
                  activeIncidentDate={activeIncidentDate}
                  productStatus={productStatus}
                />
                )}
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className='pt-12 pb-24 border-t border-t-B0C4DB'>
        {isDiversified ? <CoveredProducts products={products} /> : null}

        <Container className='grid grid-cols-3 lg:gap-32'>
          <div className={classNames(acceptedRules ? 'col-span-3 md:col-span-2' : 'col-span-3')}>
            {/* Description */}
            <span className='hidden lg:block'>
              <SeeMoreParagraph text={coverData?.coverInfoDetails?.about} />
            </span>

            <StandardTermsConditionsLink />

            {acceptedRules
              ? (
                <div className='mt-12'>
                  <ProvideLiquidityForm
                    coverKey={coverKey}
                    info={info}
                    isDiversified={isDiversified}
                    underwrittenProducts={isDiversified ? products.length : 0}
                  />
                </div>
                )
              : (
                <>
                  {isDiversified
                    ? (
                      <>
                        <DiversifiedCoverRules projectName={projectName} coverKey={coverKey} productKey={productKey} />
                        <AcceptRulesForm
                          onAccept={handleAcceptRules}
                          coverKey={coverKey}
                          activeIncidentDate={activeIncidentDate}
                          productStatus={productStatus}
                        >
                          <Trans>
                            I have read, evaluated, understood, agreed to, and
                            accepted all risks, cover terms, exclusions, standard
                            exclusions of this pool and the Neptune Mutual protocol.
                          </Trans>
                        </AcceptRulesForm>
                      </>
                      )
                    : (
                      <>
                        <CoverParameters parameters={coverData?.coverInfoDetails?.parameters} />
                        <AcceptRulesForm
                          onAccept={handleAcceptRules}
                          coverKey={coverKey}
                          activeIncidentDate={activeIncidentDate}
                          productStatus={productStatus}
                        >
                          <Trans>
                            I have read, understood, and agree to the terms of cover
                            rules
                          </Trans>
                        </AcceptRulesForm>
                      </>
                      )}
                </>
                )}
          </div>

          <span className='block col-span-3 row-start-1 lg:hidden mb-11'>
            <SeeMoreParagraph text={coverData?.coverInfoDetails?.about} />
          </span>

          {acceptedRules && (
            <LiquidityResolutionSources
              isDiversified={isDiversified}
              coverData={coverData}
              isWithdrawalWindowOpen={isWithdrawalWindowOpen}
              accrueInterest={accrueInterest}
              isWithdrawalWindowOutdated={isWithdrawalWindowOutdated}
              updateWithdrawalWindow={updateWithdrawalWindow}
            />)}
        </Container>
      </div>

      {!isDiversified && <CoverActionsFooter
        activeKey='add-liquidity'
        coverKey={coverKey}
        productKey={productKey}
                         />}
    </main>
  )
}
