import { Alert } from '@/common/Alert/Alert'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { Hero } from '@/common/Hero'
import { HeroStat } from '@/common/HeroStat'
import { HeroTitle } from '@/common/HeroTitle'
import { Seo } from '@/common/Seo'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { isValidProduct } from '@/src/helpers/cover'
import { useActivePoliciesByCover } from '@/src/hooks/useActivePoliciesByCover'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useFetchReportsByKeyAndDate } from '@/src/hooks/useFetchReportsByKeyAndDate'
import { usePagination } from '@/src/hooks/usePagination'
import { ClaimCxTokensTable } from '@/src/modules/my-policies/ClaimCxTokensTable'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'

export const ClaimDetailsPage = ({
  disabled,
  coverKey,
  productKey,
  timestamp
}) => {
  const router = useRouter()
  const { page, limit, setPage } = usePagination()

  const { coverInfo, loading } = useCoverOrProductData({
    coverKey: coverKey,
    productKey: productKey
  })
  const { data, hasMore } = useActivePoliciesByCover({
    coverKey,
    productKey,
    page,
    limit
  })
  const { data: reports, loading: loadingReports } =
    useFetchReportsByKeyAndDate({
      coverKey,
      incidentDate: timestamp
    })
  const { liquidityTokenDecimals } = useAppConstants()

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

  if (disabled) {
    return <ComingSoon />
  }

  const isDiversified = isValidProduct(productKey)

  const coverOrProductName = !isDiversified
    ? coverInfo?.infoObj?.coverName
    : coverInfo?.infoObj?.productName

  return (
    <CoverStatsProvider coverKey={coverKey} productKey={productKey}>
      <main>
        <Seo />

        <Hero>
          <Container className='px-2 py-20'>
            <BreadCrumbs
              pages={[
                {
                  name: t`My Policies`,
                  href: Routes.MyActivePolicies,
                  current: false
                },
                {
                  name: coverOrProductName,
                  href: !isDiversified
                    ? Routes.ViewCover(coverKey)
                    : Routes.ViewProduct(coverKey, productKey),
                  current: false
                },
                { name: t`Claim`, href: '#', current: true }
              ]}
            />

            <div className='flex items-start'>
              <HeroTitle>
                <Trans>My Policies</Trans>
              </HeroTitle>

              {/* My Active Protection */}
              <HeroStat title={t`My Active Protection`}>
                <>
                  {
                    formatCurrency(
                      convertFromUnits(
                        data.totalActiveProtection,
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
            <Trans>Available cxTokens for {coverOrProductName} to Claim</Trans>
          </h2>
          <p className='w-full max-w-xl py-6 mb-8 ml-0 text-lg'>
            <Trans>
              Claim your {coverOrProductName} cover cxTokens from the following
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
            activePolicies={data.activePolicies}
            coverKey={coverKey}
            incidentDate={timestamp}
            report={reports[0]}
            hasMore={hasMore}
            setPage={setPage}
            loading={hasMore}
          />
        </Container>
      </main>
    </CoverStatsProvider>
  )
}
