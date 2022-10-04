import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

import * as environment from '@/src/config/environment'
import { testData } from '@/utils/unit-tests/test-data'

const mockisDiversifiedCoversEnabled = jest.spyOn(
  environment,
  'isDiversifiedCoversEnabled'
)

jest.mock('@/src/modules/cover/CoverOptionsPage', () => ({
  CoverOptionsPage: () => {
    return <div data-testid='cover-options-page' />
  }
}))

jest.mock('@/modules/home/Hero', () => ({
  HomeHero: () => {
    return <div data-testid='home-hero' />
  }
}))

jest.mock('@/common/ProductsGrid/ProductsGrid', () => ({
  ProductsGrid: () => {
    return <div data-testid='products-grind' />
  }
}))

describe('Options test', () => {
  mockisDiversifiedCoversEnabled.mockImplementation(() => true)
  const CoverPage = require('@/src/pages/covers/[coverId]').default

  const { initialRender, rerenderFn } = initiateTest(CoverPage, {}, () => {
    mockFn.useCoverOrProductData()
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should display Cover option page Dedicated Product', () => {
    const coverOptionPage = screen.getByTestId('cover-options-page')
    expect(coverOptionPage).toBeInTheDocument()
  })

  test('Should display Home Hero And Products Grind Component Diversifed Product', () => {
    rerenderFn(CoverPage, () => {
      mockFn.useCoverOrProductData(() => {
        return { ...testData.coverInfo, supportsProducts: true }
      })
    })

    const homeHero = screen.getByTestId('home-hero')
    expect(homeHero).toBeInTheDocument()

    const productsGrind = screen.getByTestId('products-grind')
    expect(productsGrind).toBeInTheDocument()
  })
})
