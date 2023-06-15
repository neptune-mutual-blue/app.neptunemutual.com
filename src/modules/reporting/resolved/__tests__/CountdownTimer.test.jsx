import { screen } from '@testing-library/react'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { CountDownTimer } from '@/modules/reporting/resolved/CountdownTimer'
import { delay } from '@/utils/unit-tests/test-utils'

describe('CountDownTimer test', () => {
  let rerender

  beforeEach(() => {
    const { initialRender, rerenderFn } = initiateTest(CountDownTimer, {
      title: 'foo',
      target: ''
    })
    initialRender()
    rerender = rerenderFn
  })

  test('Should render Timer 00:00:00', async () => {
    const title = screen.getByText('foo')
    expect(title).toBeInTheDocument()

    const time = screen.getByText('00:00:00')
    expect(time).toBeInTheDocument()
  })

  test('Should render Timer', async () => {
    const target = Math.floor(Date.now() / 1000) + 10

    rerender({ title: 'bar', target: target })
    const title = screen.getByText('bar')
    expect(title).toBeInTheDocument()

    await delay(1100)

    const time = screen.getByText('00:00:09')
    expect(time).toBeInTheDocument()
  })
})
