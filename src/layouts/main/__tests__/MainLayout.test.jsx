import { screen } from '@/utils/unit-tests/test-utils'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { MainLayout } from '@/src/layouts/main/MainLayout'
import { testData } from '@/utils/unit-tests/test-data'

describe('MainLayout component', () => {
  beforeEach(() => {
    mockFn.useRouter({
      ...testData.router,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      }
    })

    const { initialRender } = initiateTest(MainLayout, {
      children: 'this is main layout'
    })

    initialRender()
  })

  test('should render the children passes to main layout', () => {
    const wrapper = screen.getByText('this is main layout')
    expect(wrapper).toBeInTheDocument()
  })
})
