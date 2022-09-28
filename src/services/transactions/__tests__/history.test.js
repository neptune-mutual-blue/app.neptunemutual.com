import { METHODS } from '@/src/services/transactions/const'
import { LSHistory } from '@/src/services/transactions/history'
import {
  STATUS,
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { act, waitFor } from '@testing-library/react'

jest.mock('@/src/config/environment', () => {
  return {
    timeouts: {
      waitForTransactionWithTimeout: 500
    }
  }
})

const item = {
  hash: '11222333',
  methodName: METHODS.BOND_CREATE,
  status: STATUS.PENDING,
  data: {
    value: '0.8111',
    receiveAmount: '12333',
    tokenSymbol: 'NPM'
  }
}

describe('Transaction History', () => {
  act(() => {
    LSHistory.init()
    LSHistory.setId('test-account-123456', '80001')
  })

  test('Register a pending transaction', () => {
    TransactionHistory.push(item)

    const pendingList = LSHistory.getAllPending()

    const hashListOfPending = pendingList.map(({ hash }) => hash)

    expect(pendingList.length).toBe(1)
    expect(hashListOfPending).toContain(item.hash)
  })

  describe('Transaction History update to Success', () => {
    test('pending should be 0', () => {
      TransactionHistory.push({
        ...item,
        status: STATUS.SUCCESS
      })

      const pendingList = LSHistory.getAllPending()

      expect(pendingList.length).toBe(0)
    })

    test('Succesfull should be 1', () => {
      const listOfHistory = LSHistory.get(1)

      const listOfSuccessfullHistory = listOfHistory.data.filter(
        ({ status }) => status === STATUS.SUCCESS
      )

      const hashOfHistoryList = listOfSuccessfullHistory.map(
        ({ hash }) => hash
      )

      expect(hashOfHistoryList.length).toBe(1)
      expect(hashOfHistoryList).toContain(item.hash)
    })
  })

  describe('Transaction History update to Failed', () => {
    test('Failed should be 1', () => {
      TransactionHistory.push({
        ...item,
        status: STATUS.FAILED
      })

      const listOfHistory = LSHistory.get(1)

      const listOfSuccessfullHistory = listOfHistory.data.filter(
        ({ status }) => status === STATUS.FAILED
      )

      const hashOfHistoryList = listOfSuccessfullHistory.map(
        ({ hash }) => hash
      )

      expect(hashOfHistoryList.length).toBe(1)
      expect(hashOfHistoryList).toContain(item.hash)
    })

    const onUpdate = jest.fn((_item) => {})

    test('Should update twice only!', () => {
      const listener = TransactionHistory.on(onUpdate)

      TransactionHistory.push({
        ...item,
        status: STATUS.SUCCESS
      })

      TransactionHistory.push({
        ...item,
        status: STATUS.SUCCESS
      })

      listener.off()

      // this should not emit since we've unsubscribed already
      TransactionHistory.push({
        ...item,
        status: STATUS.SUCCESS
      })

      expect(onUpdate).toHaveBeenCalledTimes(2)
    })
  })

  describe('Process Callback testing', () => {
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

    const provider = {
      getTransactionReceipt: jest.fn((hash) => {
        if (hash.startsWith('1')) {
          return Promise.resolve(hash)
        }

        if (hash.startsWith('2')) {
          return Promise.resolve(null)
        }

        return Promise.reject(hash)
      }),
      waitForTransaction: jest.fn((hash) => {
        if (hash.endsWith('1')) {
          return Promise.resolve(hash)
        }

        if (hash.endsWith('3')) {
          return new Promise(() => {})
        }

        return Promise.reject(hash)
      })
    }

    const success = jest.fn(() => {})
    const failure = jest.fn(() => {})

    test('Should get 9 pending', () => {
      items.forEach((item) => TransactionHistory.push(item))

      const pending = LSHistory.getAllPending()

      expect(pending.length).toBe(items.length)
    })

    test('Process callback should emit successful', async () => {
      TransactionHistory.process(
        TransactionHistory.callback(provider, {
          success,
          failure
        })
      )
      await waitFor(() => {
        expect(provider.getTransactionReceipt).toHaveBeenCalledTimes(
          items.length
        )
      })
    })

    test('should call waitForTransaction 3 times', () => {
      expect(provider.waitForTransaction).toHaveBeenCalledTimes(3)
    })

    test('should call success 4 times', () => {
      expect(success).toHaveBeenCalledTimes(4)
    })

    test('should call failure 4 times', () => {
      expect(failure).toHaveBeenCalledTimes(4)
    })

    test('should clear', () => {
      LSHistory.clear()
      expect(LSHistory.state).toMatchObject({
        'test-account-123456:80001': []
      })
    })
  })

  describe('LSHistoryClass should throw an error', () => {
    test('Should throw and Invalid Shape error and use default value in state using string', () => {
      TransactionHistory.push('invalid')
      LSHistory.init()
      expect(LSHistory.state).toMatchObject({})
    })

    test('Should throw and Invalid Shape error and use default value in state using invalid object', () => {
      TransactionHistory.push({ invalid: true })
      LSHistory.init()
      expect(LSHistory.state).toMatchObject({})
    })
  })

  describe('LSHistory default value test', () => {
    test('LSHistory.get should return default value', () => {
      const get = LSHistory.get(1)
      expect(get).toMatchObject({
        data: [],
        maxPage: 1
      })
    })

    test('LSHistory.get without parameter pass should return default value', () => {
      const get = LSHistory.get()
      expect(get).toMatchObject({
        data: [],
        maxPage: 1
      })
    })

    test('LSHistory.get should return default value', () => {
      const pending = LSHistory.getAllPending()
      expect(pending).toMatchObject([])
    })

    test('LSHistory.init verifyShapeIntegrity function should return default', () => {
      localStorage.setItem('npmTransactionHistory', '{"invalid":true}')

      LSHistory.init()
      const state = LSHistory.state
      expect(state).toMatchObject({})
    })
  })
})
