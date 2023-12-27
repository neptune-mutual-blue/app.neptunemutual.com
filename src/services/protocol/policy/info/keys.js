import { utils } from '@neptunemutual/sdk'

const isPolicyDisabled = (
  coverKey,
  productKey,
  property = 'policyDisabledStatus'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.POLICY_DISABLED,
      coverKey,
      productKey
    ],
    signature: ['bytes32', 'bytes32', 'bytes32'],
    returns: 'bool',
    property
  }
}

export const getKeys = async (coverKey, productKey) => {
  return [
    isPolicyDisabled(
      coverKey,
      productKey
    )
  ]
}
