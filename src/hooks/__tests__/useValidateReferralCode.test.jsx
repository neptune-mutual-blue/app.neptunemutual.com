import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useValidateReferralCode } from '../useValidateReferralCode'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  referralCode: '1CODE'
}

const mockReturnData = {
  message: 'ok'
}

describe('useValidateReferralCode', () => {
  test('trimmed has empty value', async () => {
    mockHooksOrMethods.useDebounce('')

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    )

    expect(result.isValid).toBe(true)
    expect(result.errorMessage).toEqual('')
    expect(result.isPending).toBe(false)
  })

  test('trimmed has value w/ error', async () => {
    mockHooksOrMethods.useDebounce('code')

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    )

    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toEqual('Invalid Referral Code')
    expect(result.isPending).toBe(false)
  })

  test('while fetching successfully', async () => {
    mockHooksOrMethods.useDebounce('code')
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    )

    expect(result.isValid).toBe(true)
    expect(result.errorMessage).toEqual('')
    expect(result.isPending).toBe(false)
  })
})
