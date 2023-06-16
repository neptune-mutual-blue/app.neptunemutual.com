import PageNotFound from '@/src/pages/404'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { screen } from '@testing-library/react'

describe('404 test', () => {
  const { initialRender } = initiateTest(PageNotFound,
    {},
    () => {
      mockHooksOrMethods.useRouter()
    })

  beforeEach(() => {
    initialRender()
  })

  test('should display not found page', () => {
    const statuScode = screen.getByText('404')
    expect(statuScode).toBeInTheDocument()

    const message = screen.getByText(
      'Oops! Looks like you’re heading to a wrong planet.'
    )
    expect(message).toBeInTheDocument()

    const link = screen.getByText('Take me back to homepage')
    expect(link).toBeInTheDocument()

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/404.svg')
  })
})
