/*
File: calculate-boost.js
Author: Neptune Mutual
Description: This file contains a JavaScript implementation of the Solidity function "calculateBoost".
License: Apache 2.0
*/

import { Trans } from '@lingui/macro'

const _ONE_DAY = 86400
const _DENOMINATOR = 10_000

/**
* Calculates the boost based on the expiry duration
* @param {number} expiryDuration - the expiry duration in seconds
* @returns {number} - the calculated boost
*/
export const calculateBoost = (expiryDuration) => {
  const _BOOST_FLOOR = 10_000
  const _BOOST_CEILING = 40_000

  if (expiryDuration >= 1456 * _ONE_DAY) {
    return _BOOST_CEILING
  }

  const result = 2 ** ((expiryDuration / (_ONE_DAY * 1460)) * Math.log2(_BOOST_CEILING / _DENOMINATOR)) * _DENOMINATOR

  if (result < _BOOST_FLOOR) {
    return _BOOST_FLOOR
  }

  if (result > _BOOST_CEILING) {
    return _BOOST_CEILING
  }

  return result
}

export const getBoostText = (boost = 0) => {
  if (boost >= 3.98) {
    return <Trans>Maximum Boost</Trans>
  }

  if (boost <= 1.03) {
    return <Trans>Minimum Boost</Trans>
  }

  if (boost > 3) {
    return <Trans>High Boost</Trans>
  }

  if (boost >= 2 && boost <= 3) {
    return <Trans>Average Boost</Trans>
  }

  if (boost < 2) {
    return <Trans>Low Boost</Trans>
  }
}

export const getBoostTextClass = (boost) => {
  if (boost >= 3.98) {
    return 'text-479E28'
  }

  if (boost <= 1.03) {
    return 'text-EAAA08'
  }

  if (boost > 3) {
    return 'text-1570EF'
  }

  if (boost >= 2 && boost <= 3) {
    return 'text-BA24D5'
  }

  if (boost < 2) {
    return 'text-E31B54'
  }
}
