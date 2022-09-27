import React from 'react'
import {
  render,
  screen,
  cleanup,
  fireEvent
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { AvailableCovers } from '@/modules/home/AvailableCovers'
import { CARDS_PER_PAGE } from '@/src/config/constants'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'

describe('AvailableCovers test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockFn.useCovers()
    mockFn.useFlattenedCoverProducts()
    mockFn.useCoverOrProductData()

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
    const links = screen.getAllByTestId('cover-link')
    expect(links.length).toBe(12)
  })

  test('should render correct cover link href', () => {
    const href = `/covers/${safeParseBytes32String(testData.covers[0].id)}`
    const link = screen.getAllByTestId('cover-link')[0]
    expect(link).toHaveAttribute('href', href)
  })

  test('should render `Show More` button by default', () => {
    const btn = screen.getByTestId('show-more-button')
    expect(btn).toBeInTheDocument()
  })

  test('should show more cover cards on `Show More` button click', () => {
    const btn = screen.getByTestId('show-more-button')
    fireEvent.click(btn)

    const coverNumbers =
      testData.covers.length >= 12 + CARDS_PER_PAGE
        ? 12 + CARDS_PER_PAGE
        : testData.covers.length
    const links = screen.getAllByTestId('cover-link')
    expect(links.length).toBe(coverNumbers)
  })

  test('should render the `No data found` if not loading & no available covers', async () => {
    cleanup()

    mockFn.useCovers(() => ({
      data: [],
      loading: false
    }))
    mockFn.useFlattenedCoverProducts(() => ({
      data: [],
      loading: false
    }))

    render(<AvailableCovers />)

    const wrapper = screen.getByTestId('no-data')
    expect(wrapper).toBeInTheDocument()
  })

  test('testing by setting the `loading` state to true', () => {
    cleanup()

    mockFn.useCovers(() => ({
      data: [],
      loading: true
    }))
    mockFn.useFlattenedCoverProducts(() => ({
      data: [],
      loading: true
    }))

    render(<AvailableCovers />)

    const noData = screen.queryByTestId('no-data')
    expect(noData).not.toBeInTheDocument()
    const links = screen.queryAllByTestId('cover-link')
    expect(links.length).toBe(0)
  })

  test('simulating input search', () => {
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Animated' } })
    expect(input).toBeInTheDocument()
  })
})
