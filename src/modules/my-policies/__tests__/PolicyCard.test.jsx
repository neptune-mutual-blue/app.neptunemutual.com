import React from 'react'
import { render, act, cleanup, screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { PolicyCard } from '@/modules/my-policies/PolicyCard'

import { getCoverImgSrc } from '@/src/helpers/cover'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'

describe('PolicyCard test', () => {
  const props = {
    policyInfo: {
      id: '0x03b4658fa53bdac8cedd7c4cec3e41ca9777db84-0x5712114cfbc297158a7d7a1142aa82da69de6dbc-1664582399',
      cxToken: {
        id: '0x5712114cfbc297158a7d7a1142aa82da69de6dbc',
        creationDate: '1658377325',
        expiryDate: '1659076653'
      },
      totalAmountToCover: '1000000000',
      expiresOn: '1664582399',
      coverKey:
        '0x6372706f6f6c0000000000000000000000000000000000000000000000000000',
      productKey:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      cover: {
        id: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000'
      },
      product: null
    }
  }

  beforeEach(() => {
    cleanup()

    mockFn.useCoverOrProductData()
    mockFn.useFetchCoverStats()
    mockFn.useValidReport()
    mockFn.useERC20Balance()

    act(() => {
      i18n.activate('en')
    })
    render(<PolicyCard {...props} />)
  })

  test('should render the main container', () => {
    const hero = screen.getByTestId('policy-card')
    expect(hero).toBeInTheDocument()
  })

  test('should not render the main container if coveInfo is not available', () => {
    cleanup()
    mockFn.useCoverOrProductData(() => null)

    render(<PolicyCard {...props} />)

    const hero = screen.queryByTestId('policy-card')
    expect(hero).not.toBeInTheDocument()
  })

  describe('Cover Image', () => {
    test('should render the cover image', () => {
      const coverImage = screen.getByTestId('cover-img')
      expect(coverImage).toBeInTheDocument()
    })

    test('cover image should have correct src', () => {
      const coverImage = screen.getByTestId('cover-img')
      const src = getCoverImgSrc({ key: testData.coverInfo.coverKey })
      expect(coverImage).toHaveAttribute('src', src)
    })

    test('cover image should have correct alt text', () => {
      const coverImage = screen.getByTestId('cover-img')
      const text = testData.coverInfo.infoObj.coverName
      expect(coverImage).toHaveAttribute('alt', text)
    })
  })

  describe('Status badge', () => {
    test("should not display anything if status is 'Normal'", () => {
      const status = screen.getByTestId('policy-card-status')
      expect(status).toHaveTextContent('')
    })

    test("should display status badge if status is not 'Normal'", () => {
      cleanup()
      mockFn.useFetchCoverStats(() => ({
        info: {
          ...testData.coverStats.info,
          productStatus: 'Normal'
        }
      }))

      mockFn.useValidReport(() => ({
        data: {
          report: {
            ...testData.reporting.validReport.data.report,
            status: 'Claimable'
          }
        }
      }))

      render(<PolicyCard {...props} />)

      const status = screen.getByTestId('policy-card-status')
      expect(status).toHaveTextContent('Claimable')
    })
  })

  test('should dsplay correct policy card title', () => {
    const title = screen.getByTestId('policy-card-title')
    expect(title).toHaveTextContent(testData.coverInfo.infoObj.coverName)
  })

  test('should render policy card footer', () => {
    const footer = screen.getByTestId('policy-card-footer')
    expect(footer).toBeInTheDocument()
  })
})
