import React from 'react'

import { AvailableCovers } from '@/modules/home/AvailableCovers'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
// import { mockFn } from '@/utils/unit-tests/helpers'
import {
  cleanup,
  fireEvent,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('AvailableCovers test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useCoversAndProducts2()

    render(<AvailableCovers />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('available-covers-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the `Cover Products` text element', () => {
    const wrapper = screen.getByText('Cover Products')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the SearchAndSortBar component', () => {
    const wrapper = screen.getByTestId('search-and-sort-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct no. of cover links', () => {
    const links = screen.queryAllByTestId('cover-link')
    expect(links.length).toBe(testData.coversAndProducts2.getAllProducts().length)
  })

  test('should render correct cover link href', () => {
    const link = screen.getAllByTestId('cover-link')[0]
    const coverHref = Routes.ViewCover(testData.coversAndProducts2.getCoverByCoverKey().coverKey)
    const productHref = Routes.ViewProduct(
      testData.coversAndProducts2.getProduct().coverKey,
      testData.coversAndProducts2.getProduct().productKey
    )
    expect([coverHref, productHref]).toContain(link.getAttribute('href'))
  })

  test('should render the `No data found` if not loading & no available covers', async () => {
    cleanup()
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        ...testData.coversAndProducts2,
        getAllProducts: () => { return [] }
      }
    })

    render(<AvailableCovers />)

    const wrapper = screen.getByTestId('no-data')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the cards skeleton when loading', () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        ...testData.coversAndProducts2,
        loading: true
      }
    })

    render(<AvailableCovers />)

    const skeletons = screen.queryAllByTestId('cards-skeleton')
    expect(skeletons.length).toEqual(CARDS_PER_PAGE)
  })

  test('simulating input search', () => {
    cleanup()
    mockHooksOrMethods.useCoversAndProducts2()
    mockHooksOrMethods.useRouter()
    render(<AvailableCovers />)

    const input = screen.queryByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Animated' } })
    expect(testData.router.replace).toHaveBeenCalled()
  })
})
