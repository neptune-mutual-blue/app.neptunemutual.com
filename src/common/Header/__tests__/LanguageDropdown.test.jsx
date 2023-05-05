import { LanguageDropdown } from '@/common/Header/LanguageDropdown'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { fireEvent, screen } from '@testing-library/react'

describe('LanguageDropdown test', () => {
  const { initialRender } = initiateTest(LanguageDropdown, {}, () => {
    mockHooksOrMethods.useRouter({ ...testData.router, push: jest.fn() })
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render language dropdown', () => {
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    fireEvent.click(button)

    const dropdown = screen.getByRole('listbox')
    expect(dropdown).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    fireEvent.click(options[0])

    const search = screen.getByRole('textbox')
    expect(search).toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'F' } })
  })
})
