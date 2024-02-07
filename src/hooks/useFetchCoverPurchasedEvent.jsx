import {
  useEffect,
  useState
} from 'react'

import DateLib from '@/lib/date/DateLib'
import { getNetworkId } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { getPolicyReceipt } from '@/src/services/api/policy/receipt'
import { toBN } from '@/utils/bn'
import { Interface } from '@ethersproject/abi'
import sdk from '@neptunemutual/sdk'

export const storePurchaseEvent = (receipt) => {
  const iface = new Interface(sdk.config.abis.IPolicy)

  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i]

    if (!log.topics.includes(iface.getEventTopic('CoverPurchased'))) {
      continue
    }

    const parsed = iface.parseLog(log)

    if (parsed.name !== 'CoverPurchased') {
      return
    }

    // Should be same as backend
    const data = {
      id: receipt.transactionHash,
      transactionHash: receipt.transactionHash,
      address: receipt.to,
      blockTimestamp: DateLib.unix(),
      blockNumber: receipt.blockNumber.toString(),
      transactionSender: receipt.from,
      chainId: getNetworkId().toString(),
      transactionStablecoinAmount: toBN(parsed.args.fee).minus(parsed.args.platformFee).toString(),
      transactionNpmAmount: null,
      gasPrice: receipt.effectiveGasPrice.toString(),
      eventName: 'CoverPurchased',
      couponCode: parsed.args.args.referralCode,
      ck: parsed.args.args.coverKey,
      pk: parsed.args.args.productKey,
      onBehalfOf: parsed.args.args.onBehalfOf,
      coverKey: parsed.args.args.coverKey,
      productKey: parsed.args.args.productKey,
      coverDuration: parsed.args.args.coverDuration.toString(),
      amountToCover: parsed.args.args.amountToCover.toString(),
      referralCode: parsed.args.args.referralCode,
      cxToken: parsed.args.cxToken,
      fee: parsed.args.fee.toString(),
      platformFee: parsed.args.platformFee.toString(),
      expiresOn: parsed.args.expiresOn.toString(),
      policyId: parsed.args.policyId.toString()
    }

    localStorage.setItem(receipt.transactionHash, JSON.stringify(data))

    return
  }
}

const getEventFromApi = async (networkId, txHash) => {
  const data = await getPolicyReceipt(networkId, txHash)

  return data
}

const getEventFromStorage = (txHash) => {
  try {
    const str = localStorage.getItem(txHash)
    const data = JSON.parse(str)

    // Delete after 30 minutes
    if (!data.blockTimestamp || data.blockTimestamp + 30 * 60 < DateLib.unix()) {
      localStorage.removeItem(txHash)
    }

    return data
  } catch (error) {}

  return null
}

const getEvent = async (networkId, txHash) => {
  const data = getEventFromStorage(txHash)

  if (data) {
    return data
  }

  return getEventFromApi(networkId, txHash)
}

export const useFetchCoverPurchasedEvent = ({ txHash }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { networkId } = useNetwork()

  useEffect(() => {
    setLoading(true)
    getEvent(networkId, txHash)
      .then((data) => {
        if (!data) { return }
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      })
  }, [networkId, txHash])

  return {
    data,
    loading
  }
}
