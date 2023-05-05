import { DEFAULT_LOCALE } from '@/src/config/locales'
import { parseLocale, useActiveLocale } from '@/src/hooks/useActiveLocale'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { mockLanguage } from '@/utils/unit-tests/test-utils'
import { renderHook } from '@testing-library/react-hooks'

describe('useActiveLocal', () => {
  mockHooksOrMethods.useRouter()

  test('should return the active local', () => {
    const { result } = renderHook(() => useActiveLocale())
    expect(result.current).toBe(testData.router.locale)
  })

  test('should return correct value based on useRouter', () => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      locale: 'zh'
    }))
    const { result } = renderHook(() => useActiveLocale())
    expect(result.current).toBe('zh')
  })

  test('should get value from navigatorLocale function if useRouter is not available', () => {
    mockLanguage.mockReturnValue('en-EN')
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      locale: undefined
    }))

    const { result } = renderHook(() => useActiveLocale())
    expect(result.current).toBe('en')
  })

  test('should return default locale if no locale in router & navigator', () => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      locale: undefined
    }))
    mockLanguage.mockReturnValue(undefined)

    const { result } = renderHook(() => useActiveLocale())
    expect(result.current).toBe(DEFAULT_LOCALE)
  })

  test('should return locale from parseLocale if no region', () => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      locale: undefined
    }))
    mockLanguage.mockReturnValue('en')

    const { result } = renderHook(() => useActiveLocale())
    expect(result.current).toBe(parseLocale('en'))
  })
})
