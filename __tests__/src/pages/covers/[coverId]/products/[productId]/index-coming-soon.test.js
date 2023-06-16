import Options from '@/pages/covers/[coverId]/products/[productId]'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

describe('Options test', () => {
  const { initialRender, rerenderFn } = initiateTest(Options, {}, () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return { ...testData.coversAndProducts2, loading: true }
    })
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should display loading text', () => {
    const loadingText = screen.getByText('loading...')
    expect(loadingText).toBeInTheDocument()
  })

  test('Should display No Data Found', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => {
        return { ...testData.coversAndProducts2, loading: false, getProduct: () => undefined }
      })
    })
    const noDataFound = screen.getByText('No Data Found')
    expect(noDataFound).toBeInTheDocument()
  })

  test('Should display Cover Options Page', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => {
        return { ...testData.coversAndProducts2, data: testData.coversAndProducts2.data, loading: false }
      })
    })
    const container = screen.getByTestId('cover-options-page')
    expect(container).toBeInTheDocument()
  })
})
