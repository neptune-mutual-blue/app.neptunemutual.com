import { act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { SelectListBar } from '@/common/SelectListBar/SelectListBar'
import { screen, waitFor } from '@testing-library/react'
import { testData } from '@/utils/unit-tests/test-data'
import { SORT_TYPES } from '@/utils/sorting'
import { t } from '@lingui/macro'

describe('SelectListBar', () => {
  const mockSetSort = jest.fn()

  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  beforeEach(() => {
    mockFn.useRouter({
      ...testData.router,
      // @ts-ignore
      query: { view: 'diversified' }
    })

    const { initialRender } = initiateTest(SelectListBar, {
      setSortType: mockSetSort,
      sortType: {
        name: t`Diversified Pool`,
        value: SORT_TYPES.DIVERSIFIED_POOL
      }
    })

    initialRender()
  })

  test('Should render select', async () => {
    const select = screen.getByTestId('select-list-bar')

    expect(select).toBeInTheDocument()
  })

  test('Should call setSortType prop on selection change', async () => {
    await waitFor(() => {
      expect(mockSetSort).toHaveBeenCalled()
    })
  })

  test('Should display correct select value', async () => {
    const select = screen.getByTestId('select-list-bar')

    expect(select).toBeInTheDocument()

    await waitFor(() => {
      expect(select).toHaveTextContent(t`Diversified Pool`)
    })
  })
})
