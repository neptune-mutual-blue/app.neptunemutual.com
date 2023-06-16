import {
  ActiveReportingCard
} from '@/modules/reporting/active/ActiveReportingCard'
import { MULTIPLIER } from '@/src/config/constants'
import { getCoverImgSrc } from '@/src/helpers/cover'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { fromNow } from '@/utils/formatter/relative-time'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

const incidentReport = testData.reporting.activeReporting[0]
const incidentReportDiversified = testData.reporting.activeReporting[1]
const data = testData.coversAndProducts2.data

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity
  const protection = activeCommitment
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  return formatPercent(utilization, 'en')
}

describe('Active Cover Reporting Card Info', () => {
  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useCoversAndProducts2()
    mockHooksOrMethods.useMyLiquidityInfo()

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReport.id,
      coverKey: incidentReport.coverKey,
      productKey: incidentReport.productKey,
      incidentDate: incidentReport.incidentDate,
      coverOrProductData: data
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
    const coverFee = `Annual Cover fee: ${formatPercent(
      toBN(data.floor).dividedBy(MULTIPLIER),
      'en'
    )}-${formatPercent(
      toBN(data.ceiling).dividedBy(MULTIPLIER),
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
      convertFromUnits(data.commitment, testData.appConstants.liquidityTokenDecimals).toString(),
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
    mockHooksOrMethods.useCoversAndProducts2(() => { return testData.productInfo })
    mockHooksOrMethods.useMyLiquidityInfo()

    const { initialRender } = initiateTest(ActiveReportingCard, {
      id: incidentReportDiversified.id,
      coverKey: incidentReportDiversified.coverKey,
      productKey: incidentReportDiversified.productKey,
      incidentDate: incidentReportDiversified.incidentDate,
      coverOrProductData: data
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
    const coverFee = `Annual Cover fee: ${formatPercent(
      toBN(data.floor).dividedBy(MULTIPLIER),
      'en'
    )}-${formatPercent(
      toBN(data.ceiling).dividedBy(MULTIPLIER),
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
      convertFromUnits(data.commitment, testData.appConstants.liquidityTokenDecimals).toString(),
      'en'
    ).short
    expect(protection).toHaveTextContent(liquidityText)

    const incidentDate = screen.getByTestId('incident-date')
    const incidentDateText = fromNow(incidentReport.incidentDate)
    expect(incidentDate).toHaveTextContent(incidentDateText)
  })
})
