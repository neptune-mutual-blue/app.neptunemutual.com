import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'

import { useValidateReferralCode } from '../useValidateReferralCode'

jest.mock('@neptunemutual/sdk')

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
  })

  test('trimmed has value w/ error', async () => {
    mockSdk.utils.keyUtil.toBytes32(false)
    mockHooksOrMethods.useDebounce('code')

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode, () => { return jest.fn() }],
      true
    )

    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toEqual('Invalid Cashback Code')
  })

  test('while fetching successfully', async () => {
    mockHooksOrMethods.useDebounce('code')
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode, () => { return jest.fn() }],
      true
    )

    expect(result.isValid).toBe(true)
    expect(result.errorMessage).toEqual('')
  })
})
