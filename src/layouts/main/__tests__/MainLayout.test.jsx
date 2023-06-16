import { MainLayout } from '@/src/layouts/main/MainLayout'
import { LocalStorage } from '@/utils/localstorage'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'

describe('MainLayout component', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter({
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

    localStorage.setItem(LocalStorage.KEYS.COOKIE_POLICY, 'true')

    initialRender()
  })

  test('should render the children passes to main layout', () => {
    const wrapper = screen.getByText('this is main layout')
    expect(wrapper).toBeInTheDocument()
    localStorage.removeItem(LocalStorage.KEYS.COOKIE_POLICY)
  })
})
