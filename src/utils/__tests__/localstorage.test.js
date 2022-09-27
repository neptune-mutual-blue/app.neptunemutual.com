const { METHODS } = require('@/src/services/transactions/const')
const { LSHistory } = require('@/src/services/transactions/history')
const {
  STATUS,
  TransactionHistory
} = require('@/src/services/transactions/transaction-history')
const { LocalStorage } = require('@/utils/localstorage')

/**
 * @typedef {import('@/src/services/transactions/history').THistory} THistory
 * @typedef {import('@/src/services/transactions/history').IHistoryEntry} IHistoryEntry
 *
 * @param {THistory} object
 */
function verifyShapeIntegrity (object) {
  return Object.values(object).every((entries) => {
    return entries.every((item) => {
      return (
        item.hasOwnProperty('hash') &&
        item.hasOwnProperty('methodName') &&
        item.hasOwnProperty('status') &&
        item.hasOwnProperty('timestamp')
      )
    })
  })
}

/**
 * @type {IHistoryEntry}
 */
const item = {
  hash: '11222333',
  methodName: METHODS.BOND_CREATE,
  status: STATUS.PENDING,
  timestamp: 1657780424042,
  data: {
    value: '0.8111',
    receiveAmount: '12333',
    tokenSymbol: 'NPM'
  }
}

describe('Local Storage', () => {
  beforeEach(() => {
    LSHistory.init()
    LSHistory.setId('test-account-123456', '80001')
  })

  test('Should retrieved values', () => {
    const items = [
      { ...item, hash: '11111111' },
      { ...item, hash: '11111112' },
      { ...item, hash: '11111113' },
      { ...item, hash: '00000001' },
      { ...item, hash: '00000002' },
      { ...item, hash: '00000003' },
      { ...item, hash: '20000001' }, // null
      { ...item, hash: '20000002' },
      { ...item, hash: '20000003' }
    ]

    items
      .slice(0)
      .reverse()
      .forEach((item) => TransactionHistory.push(item))

    const state = LocalStorage.get(
      LocalStorage.KEYS.TRANSACTION_HISTORY,
      (value) => {
        const val = JSON.parse(value)

        if (!Array.isArray(val) && verifyShapeIntegrity(val)) {
          return val
        }

        throw new Error(LocalStorage.LOCAL_STORAGE_ERRORS.INVALID_SHAPE)
      },
      // when an error is detected, we will set this default value
      {}
    )

    expect(new Set(items)).toEqual(new Set(state['test-account-123456:80001']))
  })

  test('Should reset to {}', () => {
    const items = [
      { ...item, hash: '11111111' },
      { ...item, hash: '11111112' },
      { ...item, hash: '11111113' },
      { ...item, hash: '00000001' },
      { ...item, hash: '00000002' },
      { ...item, hash: '00000003' },
      { ...item, hash: '20000001' }, // null
      { ...item, hash: '20000002' },
      { ...item, hash: '20000003' },
      {
        hash: 'qwe'
      }
    ]

    items
      .slice(0)
      .reverse()
      // @ts-ignore
      .forEach((item) => TransactionHistory.push(item))

    const state = LocalStorage.get(
      LocalStorage.KEYS.TRANSACTION_HISTORY,
      (value) => {
        const val = JSON.parse(value)

        if (!Array.isArray(val) && verifyShapeIntegrity(val)) {
          return val
        }

        throw new Error(LocalStorage.LOCAL_STORAGE_ERRORS.INVALID_SHAPE)
      },
      // when an error is detected, we will set this default value
      {}
    )

    expect({}).toEqual(state)
  })
})
