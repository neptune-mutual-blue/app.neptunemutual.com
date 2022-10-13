import Head from 'next/head'
import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { HeroStat } from '@/common/HeroStat'
import { ClaimCxTokensTable } from '@/src/modules/my-policies/ClaimCxTokensTable'
import { convertFromUnits } from '@/utils/bn'
import { useActivePoliciesByCover } from '@/src/hooks/useActivePoliciesByCover'
import { formatCurrency } from '@/utils/formatter/currency'
import { ComingSoon } from '@/common/ComingSoon'
import { useFetchReportsByKeyAndDate } from '@/src/hooks/useFetchReportsByKeyAndDate'
import { Alert } from '@/common/Alert/Alert'
import { t, Trans } from '@lingui/macro'
import { CoverStatsProvider } from '@/common/Cover/CoverStatsContext'
import { usePagination } from '@/src/hooks/usePagination'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { isValidProduct } from '@/src/helpers/cover'
import { Routes } from '@/src/config/routes'
import { useRouter } from 'next/router'

export const ClaimDetailsPage = ({
  disabled,
  coverKey,
  productKey,
  timestamp
}) => {
  const router = useRouter()
  const { page, limit, setPage } = usePagination()

  const coverInfo = useCoverOrProductData({
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

  if (!coverInfo) {
    return <Trans>loading...</Trans>
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
        <Head>
          <title>Neptune Mutual Covers</title>
          <meta
            name='description'
            content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
          />
        </Head>

        <Hero>
          <Container className='px-2 py-20'>
            <BreadCrumbs
              pages={[
                {
                  name: t`My Policies`,
                  href: Routes.MyPolicies,
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
          <h2 className='font-bold text-h2 font-sora'>
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
