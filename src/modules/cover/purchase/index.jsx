import { useState } from 'react'

import { useRouter } from 'next/router'

import { AcceptRulesForm } from '@/common/AcceptRulesForm/AcceptRulesForm'
import { Alert } from '@/common/Alert/Alert'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { CoverActionsFooter } from '@/common/Cover/CoverActionsFooter'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { SeeMoreParagraph } from '@/common/SeeMoreParagraph'
import {
  StandardTermsConditionsLink
} from '@/common/StandardTermsConditionsLink'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import {
  log,
  logPolicyPurchaseRulesAccepted
} from '@/src/services/logs'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { analyticsLogger } from '@/utils/logger'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const CoverPurchaseDetailsPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false)
  const router = useRouter()
  const { coverId, productId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String(productId || '')
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const { coverInfo, loading } = useCoverOrProductData({ coverKey, productKey })
  const { account, chainId } = useWeb3React()

  const coverStats = useCoverStatsContext()
  const isDiversified = isValidProduct(productKey)

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }
  if (!loading && !coverInfo) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
    )
  }

  const handleAcceptRules = () => {
    setAcceptedRules(true)

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
    analyticsLogger(() => {
      log(chainId, 'Purchase Policy', 'pre-purchase-policy-page', 'acknowledgement-checkbox', 2, account, 'click')
      logPolicyPurchaseRulesAccepted(chainId ?? null, account ?? null, coverId, productId)
    })
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
      {!acceptedRules && (
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
      )}

      {/* Content */}
      <div className='pt-12 pb-24 border-t border-t-B0C4DB' data-testid='body'>
        <Container className='flex justify-center'>

          <div className='w-full md:w-2/3'>
            {!acceptedRules
              ? (
                <>
                  <span>
                    <SeeMoreParagraph
                      text={coverInfo.infoObj.about}
                    />
                  </span>

                  <StandardTermsConditionsLink />
                </>
                )
              : null}

            {acceptedRules
              ? (
                <div className='flex justify-center w-full mt-12'>
                  <PurchasePolicyForm
                    coverKey={coverKey}
                    productKey={productKey}
                    coverInfo={coverInfo}
                  />
                </div>
                )
              : (
                <>
                  <CoverParameters parameters={coverInfo.infoObj?.parameters} />
                  <Alert info closable>
                    <Trans>
                      The minimum NPM token requirement will only be applicable after the TGE. For the time being, you may purchase policy and receive payouts when an incident is resolved.
                    </Trans>
                  </Alert>
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

        </Container>
      </div>

      {!acceptedRules && (
        <CoverActionsFooter
          activeKey='purchase'
          coverKey={coverKey}
          productKey={productKey}
        />
      )}
    </main>
  )
}
