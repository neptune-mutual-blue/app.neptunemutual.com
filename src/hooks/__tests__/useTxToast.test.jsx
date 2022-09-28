import { useTxToast } from '@/src/hooks/useTxToast'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useTxToast', () => {
  mockFn.useNetwork()
  mockFn.useToast()

  test('calling push function', async () => {
    const { result, act } = await renderHookWrapper(useTxToast, [])

    const mockProps = {
      tx: {
        hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77',
        wait: jest.fn(() =>
          Promise.resolve({
            status: 1
          })
        )
      },
      titles: {
        pending: 'PENDING',
        success: 'SUCCESS',
        failure: 'FAILURE'
      },
      options: {
        onTxSuccess: () => {},
        onTxFailure: () => {}
      }
    }

    await act(async () => {
      await result.push(mockProps.tx, mockProps.titles, mockProps.options)
    })

    expect(result.push).toEqual(expect.any(Function))
  })

  test('calling push function w/o tx', async () => {
    const { result, act } = await renderHookWrapper(useTxToast, [])

    const mockProps = {
      tx: null,
      titles: {
        pending: 'PENDING',
        success: 'SUCCESS',
        failure: 'FAILURE'
      },
      options: {
        onTxSuccess: () => {},
        onTxFailure: () => {}
      }
    }

    await act(async () => {
      await result.push(mockProps.tx, mockProps.titles, mockProps.options)
    })

    expect(result.push).toEqual(expect.any(Function))
  })

  test('calling push function w/ different receipt status', async () => {
    const { result, act } = await renderHookWrapper(useTxToast, [])

    const mockProps = {
      tx: {
        hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77',
        wait: jest.fn(() =>
          Promise.resolve({
            status: 2
          })
        )
      },
      titles: {
        pending: 'PENDING',
        success: 'SUCCESS',
        failure: 'FAILURE'
      },
      options: {
        onTxSuccess: () => {},
        onTxFailure: () => {}
      }
    }

    await act(async () => {
      await result.push(mockProps.tx, mockProps.titles, mockProps.options)
    })

    expect(result.push).toEqual(expect.any(Function))
  })

  test('calling pushSuccess function', async () => {
    const { result, act } = await renderHookWrapper(useTxToast, [])

    const mockProps = {
      title: 'SUCCESS',
      hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77'
    }

    await act(async () => {
      await result.pushSuccess(mockProps.title, mockProps.hash)
    })

    expect(result.pushSuccess).toEqual(expect.any(Function))
  })

  test('calling pushError function', async () => {
    const { result, act } = await renderHookWrapper(useTxToast, [])

    const mockProps = {
      title: 'SUCCESS',
      hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77'
    }

    await act(async () => {
      await result.pushError(mockProps.title, mockProps.hash)
    })

    expect(result.pushError).toEqual(expect.any(Function))
  })
})
