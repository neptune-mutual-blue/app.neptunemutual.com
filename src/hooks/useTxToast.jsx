import { ViewTxLink } from '@/common/ViewTxLink'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { useToast } from '@/lib/toast/context'
import {
  TOAST_DEFAULT_TIMEOUT,
  TOAST_NO_TIMEOUT
} from '@/src/config/toast'
import { useNetwork } from '@/src/context/Network'

export const useTxToast = () => {
  const { networkId } = useNetwork()
  const toast = useToast()

  /**
   *
   * @param {*} tx
   * @param {{pending: string, success: string, failure: string}} titles
   * @param {{onTxSuccess?: function, onTxFailure?: function}} [options]
   */
  const push = async (tx, titles, options = {}) => {
    if (!tx) {
      options?.onTxFailure && options.onTxFailure()

      return
    }

    const txLink = getTxLink(networkId, tx)

    const loadingToastId = toast.pushLoading({
      title: titles.pending,
      message: <ViewTxLink txLink={txLink} txHash={tx?.hash} />,
      lifetime: TOAST_NO_TIMEOUT
    })

    const receipt = await tx.wait(1)
    const type = receipt.status === 1 ? 'Success' : 'Error'

    toast.remove(loadingToastId)

    if (type === 'Success') {
      toast.pushSuccess({
        title: titles.success,
        message: <ViewTxLink txLink={txLink} txHash={tx?.hash} />,
        lifetime: TOAST_NO_TIMEOUT
      })

      options?.onTxSuccess && options.onTxSuccess(tx)

      return
    }

    toast.pushError({
      title: titles.failure,
      message: <ViewTxLink txLink={txLink} txHash={tx?.hash} />,
      lifetime: TOAST_NO_TIMEOUT
    })

    options?.onTxFailure && options.onTxFailure()
  }

  /**
   * @param {string} title
   * @param {string} hash
   */
  const pushSuccess = (title, hash) => {
    const txLink = getTxLink(networkId, { hash })

    toast.pushSuccess({
      title,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT
    })
  }

  /**
   * @param {string} title
   * @param {string} hash
   */
  const pushError = (title, hash) => {
    const txLink = getTxLink(networkId, { hash })

    toast.pushError({
      title,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT
    })
  }

  return { push, pushSuccess, pushError }
}
