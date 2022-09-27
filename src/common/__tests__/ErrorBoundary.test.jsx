import { act, render, screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import ErrorBoundary from '@/common/ErrorBoundary'

const ComponentWithError = () => {
  throw new Error('Error for testing')
}

describe('ErrorBoundary component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
      window.location.hash = ''
    })
    jest.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
  })

  test('should render error if occured', () => {
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })
})

describe('simulating different states', () => {
  beforeEach(() => {
    i18n.activate('en')
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/error'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/error'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/swap'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/add/v2'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/add/anything'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/remove/v2'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })

  test('should return different state according to path name', () => {
    window.location.hash = '#/remove/anything'
    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument()
  })
})
