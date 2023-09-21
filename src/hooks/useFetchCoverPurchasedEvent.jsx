import {
  useEffect,
  useState
} from 'react'

import DateLib from '@/lib/date/DateLib'
import { useNetwork } from '@/src/context/Network'
import { getPolicyReceipt } from '@/src/services/api/policy/receipt'

export const storePurchaseEvent = (event, from) => {
  const txHash = event.transactionHash

  const {
    args: { coverKey, productKey, onBehalfOf, amountToCover, referralCode },
    cxToken,
    fee,
    platformFee,
    expiresOn,
    policyId
  } = event.args

  const value = {
    event: {
      id: txHash,
      coverKey: coverKey.toString(),
      productKey: productKey.toString(),
      onBehalfOf: onBehalfOf.toString(),
      cxToken: cxToken.toString(),
      fee: fee.toString(),
      platformFee: platformFee.toString(),
      amountToCover: amountToCover.toString(),
      expiresOn: expiresOn.toString(),
      referralCode: referralCode.toString(),
      policyId: policyId.toString(),
      createdAtTimestamp: DateLib.unix(),

      transaction: {
        from
      }
    },
    expiry: DateLib.toUnix(DateLib.addMinutes(new Date(), 5))
  }

  localStorage.setItem(txHash, JSON.stringify(value))

  return txHash
}

const getEventFromApi = async (networkId, txHash) => {
  const data = await getPolicyReceipt(networkId, txHash)

  return data
}

const getEventFromStorage = async (txHash) => {
  try {
    const str = localStorage.getItem(txHash)
    const data = JSON.parse(str)

    if (data.expiry < DateLib.unix()) {
      localStorage.removeItem(txHash)
    }

    return data.event
  } catch (error) {}

  return null
}

const getEvent = async (networkId, txHash) => {
  return getEventFromStorage(txHash).then((data) => {
    if (!data) {
      return getEventFromApi(networkId, txHash)
    }

    return data
  })
}

export const useFetchCoverPurchasedEvent = ({ txHash }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
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
        console.error(error)
      })
  }, [networkId, txHash])

  return {
    data,
    loading
  }
}
