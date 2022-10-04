import { act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { SelectListBar } from '@/common/SelectListBar/SelectListBar'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { testData } from '@/utils/unit-tests/test-data'
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
      query: { coverView: 'Diversified pool' },
      replace: mockSetSort
    })

    const { initialRender } = initiateTest(SelectListBar)

    initialRender()
  })

  test('Should render select', async () => {
    const select = screen.getByTestId('select-list-bar')

    expect(select).toBeInTheDocument()
  })

  test('Should call router replace on selection change', async () => {
    const select = screen.getByTestId('select-button')

    fireEvent.click(select)
    const options = screen.getByTestId('option-2')

    fireEvent.click(options)

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
