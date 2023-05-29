import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'
import { testData } from '@/utils/unit-tests/test-data'
import { ActiveReportingCard } from '@/modules/reporting/active/ActiveReportingCard'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { MULTIPLIER } from '@/src/config/constants'
import { formatPercent } from '@/utils/formatter/percent'
import { convertFromUnits, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const incidentReport = testData.reporting.activeReporting[0]
const incidentReportDiversified = testData.reporting.activeReporting[1]

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity
  const protection = activeCommitment
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  return formatPercent(utilization, 'en')
}

describe('Active Reporting Card Loading', () => {
  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useCoverOrProductData(() => null)
    mockHooksOrMethods.useMyLiquidityInfo()
    mockHooksOrMethods.useFetchCoverStats()

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReport.id,
      coverKey: incidentReport.coverKey,
      productKey: incidentReport.productKey,
      incidentDate: incidentReport.incidentDate
    })

    initialRender()
  })

  test('should render the card skeleton while no cover or product info is fetched', () => {
    const cardSkeletons = screen.getAllByTestId('skeleton-card')
    expect(cardSkeletons.length).toBeGreaterThan(0)
  })
})

describe('Active Cover Reporting Card Info', () => {
  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useMyLiquidityInfo()
    mockHooksOrMethods.useFetchCoverStats()

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReport.id,
      coverKey: incidentReport.coverKey,
      productKey: incidentReport.productKey,
      incidentDate: incidentReport.incidentDate
    })

    initialRender()
  })

  test('should render the card info when cover info loaded', () => {
    const imgContainer = screen.getByTestId('active-report-cover-img')
    const img = imgContainer.querySelector('img')
    const src = getCoverImgSrc({
      key: testData.coverInfo.coverKey
    })
    expect(img).toHaveAttribute('src', src)

    const coverFeeWrap = screen.getByTestId('cover-fee')
    const coverFee = `Cover fee: ${formatPercent(
      testData.coverInfo.infoObj.pricingFloor / MULTIPLIER,
      'en'
    )}-${formatPercent(
      testData.coverInfo.infoObj.pricingCeiling / MULTIPLIER,
      'en'
    )}`
    expect(coverFeeWrap).toHaveTextContent(coverFee)

    const utilRatio = screen.getByTestId('util-ratio')
    const utilizationRatioText = getUtilizationRatio(
      testData.liquidityFormsContext.info.totalLiquidity,
      testData.coverStats.info.activeCommitment
    )
    expect(utilRatio).toHaveTextContent(utilizationRatioText)

    const protection = screen.getByTestId('protection')
    const liquidityText = formatCurrency(
      convertFromUnits(
        testData.coverStats.info.activeCommitment,
        testData.appConstants.liquidityTokenDecimals
      ).toString(),
      'en'
    ).short
    expect(protection).toHaveTextContent(liquidityText)

    const incidentDate = screen.getByTestId('incident-date')
    const incidentDateText = fromNow(incidentReport.incidentDate)
    expect(incidentDate).toHaveTextContent(incidentDateText)
  })
})

describe('Active Diversified Cover Reporting Card Info', () => {
  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useCoverOrProductData(() => testData.productInfo)
    mockHooksOrMethods.useMyLiquidityInfo()
    mockHooksOrMethods.useFetchCoverStats()

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReportDiversified.id,
      coverKey: incidentReportDiversified.coverKey,
      productKey: incidentReportDiversified.productKey,
      incidentDate: incidentReportDiversified.incidentDate
    })

    initialRender()
  })

  test('should render the card info when cover info loaded', () => {
    const imgContainer = screen.getByTestId('active-report-cover-img')
    const img = imgContainer.querySelector('img')
    const src = getCoverImgSrc({
      key: testData.productInfo.productKey
    })
    expect(img).toHaveAttribute('src', src)

    const coverFeeWrap = screen.getByTestId('cover-fee')
    const coverFee = `Cover fee: ${formatPercent(
      testData.productInfo.cover.infoObj.pricingFloor / MULTIPLIER,
      'en'
    )}-${formatPercent(
      testData.productInfo.cover.infoObj.pricingCeiling / MULTIPLIER,
      'en'
    )}`
    expect(coverFeeWrap).toHaveTextContent(coverFee)

    const utilRatio = screen.getByTestId('util-ratio')
    const utilizationRatioText = getUtilizationRatio(
      testData.liquidityFormsContext.info.totalLiquidity,
      testData.coverStats.info.activeCommitment
    )
    expect(utilRatio).toHaveTextContent(utilizationRatioText)

    const protection = screen.getByTestId('protection')
    const liquidityText = formatCurrency(
      convertFromUnits(
        testData.coverStats.info.activeCommitment,
        testData.appConstants.liquidityTokenDecimals
      ).toString(),
      'en'
    ).short
    expect(protection).toHaveTextContent(liquidityText)

    const incidentDate = screen.getByTestId('incident-date')
    const incidentDateText = fromNow(incidentReport.incidentDate)
    expect(incidentDate).toHaveTextContent(incidentDateText)
  })
})
