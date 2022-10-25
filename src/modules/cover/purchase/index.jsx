import { Container } from '@/common/Container/Container'
import { AcceptRulesForm } from '@/common/AcceptRulesForm/AcceptRulesForm'
import { useRouter } from 'next/router'
import { CoverActionsFooter } from '@/common/Cover/CoverActionsFooter'
import { CoverResolutionSources } from '@/common/Cover/CoverResolutionSources'
import { SeeMoreParagraph } from '@/common/SeeMoreParagraph'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { convertFromUnits, toBN } from '@/utils/bn'
import { HeroStat } from '@/common/HeroStat'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Hero } from '@/common/Hero'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { useState } from 'react'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { formatCurrency } from '@/utils/formatter/currency'
import { t, Trans } from '@lingui/macro'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { Routes } from '@/src/config/routes'
import { logPolicyPurchaseRulesAccepted } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { StandardTermsConditionsLink } from '@/common/StandardTermsConditionsLink'

export const CoverPurchaseDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false)
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const coverInfo = useCoverOrProductData({ coverKey, productKey })
  const { account } = useWeb3React()

  const coverStats = useCoverStatsContext()
  const isDiversified = isValidProduct(productKey)

  if (!coverInfo) {
    return <Trans>loading...</Trans>
  }

  const handleAcceptRules = () => {
    setAcceptedRules(true)

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
    logPolicyPurchaseRulesAccepted(account ?? null, coverKey, productKey)
  }

  const { activeCommitment, availableLiquidity } = coverStats
  const liquidity = toBN(availableLiquidity).plus(activeCommitment).toString()
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })
  const totalLiquidity = liquidity

  const projectName = !isDiversified
    ? coverInfo?.infoObj?.coverName
    : coverInfo?.infoObj?.productName

  return (
    <main>
      {/* hero */}
      <Hero>
        <Container className='px-2 py-20'>
          <BreadCrumbs
            pages={[
              { name: t`Home`, href: '/', current: false },
              {
                name: projectName,
                href: isDiversified
                  ? Routes.ViewProduct(coverKey, productKey)
                  : Routes.ViewCover(coverKey),
                current: false
              },
              { name: t`Purchase Policy`, current: true }
            ]}
          />
          <div className='flex flex-wrap md:flex-nowrap'>
            <CoverProfileInfo
              coverKey={coverKey}
              productKey={productKey}
              imgSrc={imgSrc}
              projectName={projectName}
              links={coverInfo?.infoObj?.links}
            />

            {/* Total Liquidity */}
            <HeroStat title={t`Total Liquidity`}>
              {
                formatCurrency(
                  convertFromUnits(totalLiquidity, liquidityTokenDecimals),
                  router.locale,
                  liquidityTokenSymbol,
                  true
                ).long
              }
            </HeroStat>
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className='pt-12 pb-24 border-t border-t-B0C4DB' data-testid='body'>
        <Container className='grid grid-cols-3 lg:gap-32'>
          <div className='col-span-3 md:col-span-2'>
            <span className='hidden lg:block'>
              <SeeMoreParagraph
                text={coverInfo.infoObj.about}
              />
            </span>

            <StandardTermsConditionsLink />

            {acceptedRules
              ? (
                <div className='mt-12'>
                  <PurchasePolicyForm
                    coverKey={coverKey}
                    productKey={productKey}
                  />
                </div>
                )
              : (
                <>
                  <CoverParameters parameters={coverInfo.infoObj?.parameters} />
                  <AcceptRulesForm
                    onAccept={handleAcceptRules}
                    coverKey={coverKey}
                    productKey={productKey}
                  >
                    <Trans>
                      I have read, understood, and agree to the terms of cover
                      rules
                    </Trans>
                  </AcceptRulesForm>
                </>
                )}
          </div>

          <span className='block col-span-3 row-start-1 lg:hidden mb-11'>
            <SeeMoreParagraph
              text={coverInfo?.infoObj?.about}
            />
          </span>
          <CoverResolutionSources coverInfo={coverInfo}>
            <hr className='mt-4 mb-6 border-t border-B0C4DB/60' />
            <div
              className='flex justify-between pb-2'
              title={
                formatCurrency(
                  convertFromUnits(
                    availableLiquidity,
                    liquidityTokenDecimals
                  ).toString(),
                  router.locale
                ).long
              }
            >
              <span className=''>
                <Trans>Available Liquidity: </Trans>
              </span>
              <strong className='font-bold text-right'>
                {
                  formatCurrency(
                    convertFromUnits(
                      availableLiquidity,
                      liquidityTokenDecimals
                    ).toString(),
                    router.locale
                  ).short
                }
              </strong>
            </div>
          </CoverResolutionSources>
        </Container>
      </div>

      <CoverActionsFooter
        activeKey='purchase'
        coverKey={coverKey}
        productKey={productKey}
      />
    </main>
  )
}
