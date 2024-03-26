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
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { useActivePoliciesByCover } from '@/src/hooks/useActivePoliciesByCover'
import {
  useFetchReportsByKeyAndDate
} from '@/src/hooks/useFetchReportsByKeyAndDate'
import { usePagination } from '@/src/hooks/usePagination'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  ClaimCxTokensTable
} from '@/src/modules/my-policies/ClaimCxTokensTable'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

export const ClaimDetailsPage = ({
  disabled,
  coverKey,
  productKey,
  timestamp
}) => {
  const { locale } = useLanguageContext()
  const { networkId } = useNetwork()
  const { page, limit, setPage } = usePagination()

  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()
  const isDiversified = isValidProduct(productKey)
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

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

  if (dataLoading) {
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
                href: Routes.MyActivePolicies(networkId),
                current: false
              },
              {
                name: projectOrProductName,
                href: !isDiversified
                  ? Routes.ViewCover(coverKey, networkId)
                  : Routes.ViewProduct(coverKey, productKey, networkId),
                current: false
              },
              { name: <Trans>Claim</Trans>, href: '#', current: true }
            ]}
          />

          <div className='flex items-start'>
            <HeroTitle>
              <Trans>My Policies</Trans>
            </HeroTitle>

            {/* My Active Protection */}
            <HeroStat title={<Trans>My Active Protection</Trans>}>
              <>
                {
                    formatCurrency(
                      convertFromUnits(
                        data.totalActiveProtection,
                        liquidityTokenDecimals
                      ),
                      locale,
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
  )
}
