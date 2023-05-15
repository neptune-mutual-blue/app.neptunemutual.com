/*
File: calculate-boost.js
Author: Neptune Mutual
Description: This file contains a JavaScript implementation of the Solidity function "calculateBoost".
License: Apache 2.0
*/

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

  if (expiryDuration > 1460 * _ONE_DAY) {
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
