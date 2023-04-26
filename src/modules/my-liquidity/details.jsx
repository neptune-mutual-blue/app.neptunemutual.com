import { useRouter } from 'next/router'

import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import {
  DiversifiedCoverProfileInfo
} from '@/common/CoverProfileInfo/DiversifiedCoverProfileInfo'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
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
import { CoveredProducts } from '@/modules/my-liquidity/content/CoveredProducts'
import { CoverStatus } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  t,
  Trans
} from '@lingui/macro'

export const ProvideLiquidityToCover = ({ coverKey, productKey }) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()
  const { accrueInterest, isWithdrawalWindowOpen, info } = useLiquidityFormsContext()
  const coverData = getCoverByCoverKey(coverKey)

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
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
  const myLiquidity = info.myUnrealizedShare
  const products = isDiversified ? getProductsByCoverKey(coverKey) : []

  return (
    <div className='bg-F6F7F9' data-testid='main-container'>
      {/* hero */}
      <Hero>
        <Container className='px-2 py-20 min-h-[312px]'>
          <BreadCrumbs
            data-testid='breadcrumbs'
            pages={[
              {
                name: t`My Liquidity`,
                href: Routes.MyLiquidity,
                current: false
              },
              {
                name: projectName,
                href: '#',
                current: true
              }
            ]}
          />
          <div className='flex flex-wrap md:flex-nowrap'>
            {isDiversified
              ? (
                <DiversifiedCoverProfileInfo
                  projectName={projectName}
                />
                )
              : (
                <CoverProfileInfo
                  productKey={productKey}
                  coverKey={coverKey}
                  projectName={projectName}
                  links={coverData?.coverInfoDetails?.links}
                  imgSrc={imgSrc}
                  activeIncidentDate={activeIncidentDate}
                  productStatus={productStatus}
                />
                )}

            {/* My Liquidity */}
            <HeroStat title={t`My Liquidity`} data-testid='herostat'>
              {
                formatCurrency(
                  convertFromUnits(myLiquidity, liquidityTokenDecimals),
                  router.locale
                ).long
              }
            </HeroStat>
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className='pt-12 pb-24 border-t border-t-B0C4DB'>
        {isDiversified ? <CoveredProducts products={products} /> : null}

        <Container className='grid grid-cols-3 lg:gap-32'>
          <div className='col-span-3 md:col-span-2'>
            {/* Description */}
            <span className='hidden lg:block' data-testid='see-more-container'>
              <SeeMoreParagraph text={coverData?.coverInfoDetails?.about} />
            </span>

            <StandardTermsConditionsLink />

            <div className='mt-12' data-testid='provide-liquidity-container'>
              <ProvideLiquidityForm
                coverKey={coverKey}
                info={info}
                isDiversified={isDiversified}
                underwrittenProducts={isDiversified ? products.length : 0}
              />
            </div>
          </div>

          <span className='block col-span-3 row-start-1 lg:hidden mb-11'>
            <SeeMoreParagraph text={coverData?.coverInfoDetails?.about} />
          </span>

          <LiquidityResolutionSources
            isDiversified={isDiversified}
            coverData={coverData}
            isWithdrawalWindowOpen={isWithdrawalWindowOpen}
            accrueInterest={accrueInterest}
          />
        </Container>
      </div>
    </div>
  )
}
