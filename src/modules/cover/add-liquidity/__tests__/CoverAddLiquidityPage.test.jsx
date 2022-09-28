import React from 'react'
import { render, act, fireEvent, waitFor } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { CoverAddLiquidityDetailsPage } from '@/modules/cover/add-liquidity'
import * as CoverOrProductData from '@/src/hooks/useCoverOrProductData'

jest.mock('next/link', () => {
  return ({ children }) => {
    return children
  }
})

const mockCoverDetails = {
  coverKey:
    '0x6262382d65786368616e67650000000000000000000000000000000000000000',
  infoObj: {
    about:
      "BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they're looking for.",
    coverName: 'Bb8 Exchange Cover',
    links: '{blog: "https://bb8-exchange.medium.com", documenta…}',
    leverage: '1',
    projectName: 'Bb8 Exchange',
    tags: '["Smart Contract", "DeFi", "Exchange"]',
    rules:
      '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
    pricingFloor: 200,
    pricingCeiling: 1400,
    resolutionSources: '["https://twitter.com/BB8Exchange", "https://twitte…]'
  },
  reportingPeriod: 1800,
  cooldownPeriod: 300,
  claimPeriod: 1800,
  minReportingStake: '5000000000000000000000',
  stakeWithFees: '50000000000000000000000',
  reassurance: '20000000000000000000000',
  liquidity: '5685029588525899752492213',
  utilization: '0.01',
  products: [],
  supportsProducts: false
}

describe('CoverAddLiquidityPage.test', () => {
  beforeAll(async () => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should show add liquidity form after accepting rules', async () => {
    jest
      .spyOn(CoverOrProductData, 'useCoverOrProductData')
      .mockImplementation(() => mockCoverDetails)

    const { getByTestId } = render(<CoverAddLiquidityDetailsPage />)

    await waitFor(() => {
      expect(getByTestId('accept-rules-check-box')).toBeInTheDocument()
    })

    const acceptRulesCheckbox = getByTestId('accept-rules-check-box')
    const acceptRulesNextButton = getByTestId('accept-rules-next-button')

    fireEvent.click(acceptRulesCheckbox)
    fireEvent.click(acceptRulesNextButton)

    expect(getByTestId('add-liquidity-form')).toBeInTheDocument()
  })

  test('should show loading if coverinfo is null ', async () => {
    jest
      .spyOn(CoverOrProductData, 'useCoverOrProductData')
      .mockImplementation(() => {})

    const { getByText } = render(<CoverAddLiquidityDetailsPage />)

    await waitFor(() => {
      expect(getByText(/loading/)).toBeInTheDocument()
    })
  })
})
