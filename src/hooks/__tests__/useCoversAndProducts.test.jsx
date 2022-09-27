import {
  CoversAndProductsProvider,
  useCoversAndProducts
} from '@/src/context/CoversAndProductsData'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import React from 'react'

describe('useCoversAndProducts', () => {
  mockFn.getCoverData()
  mockFn.getCoverProductData()
  const params = {
    coverKey:
      '0x7072696d65000000000000000000000000000000000000000000000000000000',
    productKey:
      '0x636861696e6c696e6b0000000000000000000000000000000000000000000000',
    networkId: 43113
  }

  const wrapper = ({ children }) => (
    <CoversAndProductsProvider>{children}</CoversAndProductsProvider>
  )

  test('calling the return function with all valid data', async () => {
    const { result, act } = await renderHookWrapper(
      useCoversAndProducts,
      [],
      false,
      {
        wrapper
      }
    )

    act(() => {
      result.getCoverOrProductData(params)
    })
  })

  test('calling the return function with invalid product key', async () => {
    const { result, act } = await renderHookWrapper(
      useCoversAndProducts,
      [],
      false,
      {
        wrapper
      }
    )

    await act(async () => {
      await result.getCoverOrProductData({
        ...params,
        productKey: '0x00000000'
      })
    })

    await act(async () => {
      await result.getCoverOrProductData({
        ...params,
        productKey: '0x00000000'
      })
    })
  })

  test('using hook without provider', async () => {
    await renderHookWrapper(useCoversAndProducts)
  })
})
