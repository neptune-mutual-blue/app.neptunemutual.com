import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { useAuthValidation } from '../useAuthValidation'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useAuthValidation', () => {
  mockHooksOrMethods.useToast()

  test('should return nothing', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(useAuthValidation)

    act(() => {
      result.requiresAuth()
    })

    expect(result.requiresAuth).toEqual(expect.any(Function))
  })

  test('should require auth', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: '0x32423dfsf34' }))

    const { result, act } = await renderHookWrapper(useAuthValidation)

    act(() => {
      result.requiresAuth()
    })

    expect(result.requiresAuth).toEqual(expect.any(Function))
  })
})
