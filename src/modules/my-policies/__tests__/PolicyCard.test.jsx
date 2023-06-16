import { PolicyCard } from '@/modules/my-policies/PolicyCard'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  act,
  cleanup,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const data = testData.coversAndProducts2.data

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
describe('PolicyCard test', () => {
  const { initialRender, rerenderFn } = initiateTest(PolicyCard, {
    policyInfo: props.policyInfo,
    coverOrProductData: data

  }, () => {
    mockHooksOrMethods.useValidReport()
    mockHooksOrMethods.useERC20Balance()
  })

  beforeEach(() => {
    cleanup()

    act(() => {
      i18n.activate('en')
    })

    initialRender()
  })

  test('should render the main container', () => {
    const hero = screen.getByTestId('policy-card')
    expect(hero).toBeInTheDocument()
  })

  test('should not render the main container if coveInfo is not available', () => {
    cleanup()

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
      const src = getCoverImgSrc({ key: props.policyInfo.coverKey })
      expect(coverImage).toHaveAttribute('src', src)
    })

    test('cover image should have correct alt text', () => {
      const coverImage = screen.getByTestId('cover-img')
      const text = data.coverInfoDetails.coverName
      expect(coverImage).toHaveAttribute('alt', text)
    })
  })

  describe('Status badge', () => {
    test("should not display anything if status is 'Normal'", () => {
      const status = screen.getByTestId('policy-card-status')
      expect(status).toHaveTextContent('')
    })

    test("should display status badge if status is not 'Normal'", () => {
      rerenderFn({
        policyInfo: {
          ...props.policyInfo,
          productStatus: '4',
          productStatusEnum: 'Claimable',
          claimBeginsFrom: '46445',
          claimExpiresAt: ''
        }
      })

      const status = screen.getByTestId('policy-card-status')
      expect(status).toHaveTextContent('Claimable')
    })
  })

  test('should dsplay correct policy card title', () => {
    const title = screen.getByTestId('policy-card-title')
    expect(title).toHaveTextContent(data.coverInfoDetails.coverName)
  })

  test('should render policy card footer', () => {
    const footer = screen.getByTestId('policy-card-footer')
    expect(footer).toBeInTheDocument()
  })
})
