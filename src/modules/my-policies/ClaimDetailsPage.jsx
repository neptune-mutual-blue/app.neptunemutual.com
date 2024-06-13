import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { Seo } from '@/common/Seo'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { isValidProduct } from '@/src/helpers/cover'

import {
  ClaimCxTokensTable
} from '@/src/modules/my-policies/ClaimCxTokensTable'
import { convertFromUnits, sumOf } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import { useActiveReportings } from '@/src/hooks/useActiveReportings'
import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import { useAppConstants } from '@/src/context/AppConstants'

export const ClaimDetailsPage = ({
  disabled,
  coverKey,
  productKey,
  timestamp
}) => {
  const router = useRouter()

  const { liquidityTokenDecimals } = useAppConstants()

  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts()
  const isDiversified = isValidProduct(productKey)
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  const { data: allActivePolicies, loading } = useActivePolicies()
  const policies = allActivePolicies.activePolicies.filter(x => { return x.coverKey === coverKey && x.productKey === productKey })
  const totalActiveProtection = sumOf(...policies.map(policy => { return policy.amount })).toString()

  const { data: { incidentReports: allIncidentReports }, loading: loadingReports } = useActiveReportings()
  const reports = allIncidentReports.filter(x => { return x.incidentDate.toString() === timestamp.toString() && x.coverKey === coverKey && x.productKey === productKey })

  if (dataLoading || loading) {
    return (
      <Loading />
    )
  }
  if (!coverOrProductData) {
    return (
      <NoDataFound />
    )
  }

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 pt-5 pb-20 md:py-20'>
          <BreadCrumbs
            pages={[
              {
                name: <Trans>My Policies</Trans>,
                href: Routes.MyActivePolicies,
                current: false
              },
              {
                name: projectOrProductName,
                href: !isDiversified
                  ? Routes.ViewCover(coverKey)
                  : Routes.ViewProduct(coverKey, productKey),
                current: false
              },
              { name: <Trans>Claim</Trans>, href: '#', current: true }
            ]}
          />

          <div className='flex flex-wrap items-start'>
            <HeroTitle>
              <Trans>My Policies</Trans>
            </HeroTitle>

            {/* My Active Protection */}
            <HeroStat title={<Trans>My Active Protection</Trans>}>
              <>
                {
                    formatCurrency(
                      convertFromUnits(
                        totalActiveProtection,
                        liquidityTokenDecimals
                      ),
                      router.locale,
                      'USD'
                    ).long
                  }
              </>
            </HeroStat>
          </div>
        </Container>

        <hr className='border-B0C4DB' />
      </Hero>

      <Container className='px-2 pt-12 pb-36'>
        <h2 className='font-bold text-display-sm'>
          <Trans>Available cxTokens for {projectOrProductName} to Claim</Trans>
        </h2>
        <p className='w-full max-w-xl py-6 mb-8 ml-0 text-lg'>
          <Trans>
            Claim your {projectOrProductName} cover cxTokens from the following
            addresses before the given claim date. Also indicated is the
            amount of cxTokens you will receive per claim.
          </Trans>
        </p>

        {!loadingReports && reports.length === 0 && (
          <Alert>
            <Trans>
              No valid incidents are reported with the given timestamp
            </Trans>
          </Alert>
        )}

        <ClaimCxTokensTable
          claimPlatformFee={coverOrProductData.claimPlatformFee}
          activePolicies={policies}
          coverKey={coverKey}
          productKey={productKey}
          incidentDate={timestamp}
          claimExpiresAt={reports[0]?.claimExpiresAt || 0}
          loading={loading}
        />
      </Container>
    </main>
  )
}
