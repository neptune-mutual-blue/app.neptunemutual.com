import {
  act,
  cleanup,
  render
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import {
  act as hooksAct,
  renderHook
} from '@testing-library/react-hooks'

export const initiateTest = (
  Component,
  props = {},
  initialMocks = () => {},
  options = {}
) => {
  const initialRender = (newProps = {}, newMocks = () => {}) => {
    cleanup()
    initialMocks()
    newMocks()
    act(() => {
      i18n.activate('en')
    })

    return render(<Component {...props} {...newProps} />, options)
  }

  const rerenderFn = (newProps = {}, mocks = () => {}) => {
    return initialRender(newProps, mocks)
  }

  return {
    initialRender,
    rerenderFn
  }
}

/**
 * @typedef renderHookWrapperReturn
 * @property {Object} result
 * @property {Function} act
 * @property {Function} rerender
 * @property {Function} unmount
 * @property {Function} [waitForNextUpdate]
 * @property {Object} [renderHookResult]
 */

/**
 *
 * @param {Function} hookFunction
 * @param {any[]} [hookArgs]
 * @param {boolean | number} [waitForNextUpdate]
 * @param {Object} [renderHookOptions]
 * @returns {Promise<renderHookWrapperReturn>}
 *
 */
export const renderHookWrapper = async (
  hookFunction,
  hookArgs = [],
  waitForNextUpdate = false,
  renderHookOptions = {}
) => {
  let res = {}
  let rr = () => {}
  let u = () => {}
  let wfnu = () => {}
  let renderHookResult = {}

  await hooksAct(async () => {
    i18n.activate('en')
    const {
      result,
      waitForNextUpdate: WFNU,
      rerender,
      unmount
    } = renderHook((args) => hookFunction(...args), {
      initialProps: hookArgs,
      ...renderHookOptions
    })

    if (typeof waitForNextUpdate === 'boolean' && waitForNextUpdate === true) {
      await WFNU()
    } else if (typeof waitForNextUpdate === 'number') {
      await WFNU({ timeout: waitForNextUpdate })
    }

    res = result.current
    rr = rerender
    u = unmount
    wfnu = WFNU
    renderHookResult = result
  })
  return {
    result: res,
    act: hooksAct,
    rerender: rr,
    unmount: u,
    waitForNextUpdate: wfnu,
    renderHookResult
  }
}
