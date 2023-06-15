import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

// const mockisDiversifiedCoversEnabled = jest.spyOn(
//   environment,
//   'isDiversifiedCoversEnabled'
// )

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
  // mockisDiversifiedCoversEnabled.mockImplementation(() => true)
  const CoverPage = require('@/src/pages/covers/[coverId]').default

  const { initialRender, rerenderFn } = initiateTest(CoverPage, {}, () => {
    // mockHooksOrMethods.useCoverOrProductData()
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
      // mockHooksOrMethods.useCoverOrProductData(() => {
      //   return { ...testData.coverInfo, supportsProducts: true }
      // })
    })

    const homeHero = screen.getByTestId('home-hero')
    expect(homeHero).toBeInTheDocument()

    const productsGrind = screen.getByTestId('products-grind')
    expect(productsGrind).toBeInTheDocument()
  })
})
