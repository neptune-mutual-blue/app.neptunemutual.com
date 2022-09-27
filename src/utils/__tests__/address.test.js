import * as address from '@/src/utils/address'

const { truncateAddress, truncateAddressParam } = address

describe('addess test', () => {
  test('truncateAddress test', () => {
    const address = truncateAddress('1234567890')
    expect(address).toBe('1234....7890')
  })

  test('truncateAddressParam test', () => {
    const address = truncateAddressParam('1234567890')
    expect(address).toBe('1234...7890')
  })

  test('truncateAddressParam test pass 2nd and 3rd parameter', () => {
    const address = truncateAddressParam('1234567890', 3, -3)
    expect(address).toBe('123...890')
  })
})
