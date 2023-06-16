import CoverPage from '@/src/pages/covers/[coverId]'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

describe('Options test', () => {
  const { initialRender } = initiateTest(CoverPage, {}, () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return { ...testData.coversAndProducts2, loading: true }
    })
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should display Hero Skeleton', () => {
    const skeleton = screen.getByTestId('hero-skeleton')
    expect(skeleton).toBeInTheDocument()
  })
})
