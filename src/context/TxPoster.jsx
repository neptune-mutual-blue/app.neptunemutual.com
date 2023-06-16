import React, {
  useCallback,
  useState
} from 'react'

import { Divider } from '@/common/Divider/Divider'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { DEFAULT_GAS_LIMIT } from '@/src/config/constants'
import { getErrorMessage } from '@/src/helpers/tx'
import { useTransactionHistory } from '@/src/hooks/useTransactionHistory'
import { contractRead } from '@/src/services/readContract'
import { calculateGasMargin } from '@/utils/bn'
import * as Dialog from '@radix-ui/react-dialog'

const initValue = {
  // prettier-ignore
  writeContract: async ({instance, methodName, overrides = {},  args = [],  onTransactionResult, onRetryCancel, onError}) => {}, // eslint-disable-line
  contractRead
}

const TxPosterContext = React.createContext(initValue)

export function useTxPoster () {
  const context = React.useContext(TxPosterContext)
  if (context === undefined) {
    throw new Error('useTxPoster must be used within a TxPosterProvider')
  }

  return context
}

export const TxPosterProvider = ({ children }) => {
  const [data, setData] = useState({
    description: '',
    message: '',
    isError: false,
    pendingInvokeArgs: {}
  })

  useTransactionHistory()

  const writeContract = useCallback(
    async ({
      instance,
      methodName,
      overrides = {},
      args = [],
      onTransactionResult = (_tx) => {},
      onRetryCancel = () => {},
      onError = console.error
    }) => {
      if (!instance) {
        onError(new Error('Instance not found'))

        return
      }

      let estimatedGas = null

      try {
        estimatedGas = await instance.estimateGas[methodName](...args, { ...overrides })

        try {
          const tx = await instance[methodName](...args, {
            gasLimit: calculateGasMargin(estimatedGas),
            ...overrides
          })

          onTransactionResult(tx)
        } catch (error) {
          // This failure is not caused by estimating gas, so do not show the popup
          // This might have been triggered by user rejecting the transaction
          onError(error)
        }
      } catch (err) {
        console.log(`Could not estimate gas for "${methodName}", args: `, args)

        onError(err)

        // Could not estimate gas, therefore could not proceed
        // Shows popup (with following description and message) and wait for user confirmation
        const argsStr = JSON.stringify(args)
        const description = `Could not estimate gas for "${methodName}", args: ${argsStr}`

        setData({
          description: description,
          message: getErrorMessage(err, instance),
          isError: true,
          pendingInvokeArgs: {
            instance,
            methodName,
            overrides,
            args,
            onTransactionResult,
            onRetryCancel,
            onError
          }
        })
      }
    },
    []
  )

  const handleContinue = async () => {
    const {
      instance,
      methodName,
      overrides,
      args,
      onTransactionResult,
      onError
    } = data.pendingInvokeArgs

    try {
      // Closes modal and clears data
      setData({
        description: '',
        message: '',
        isError: false,
        pendingInvokeArgs: {}
      })

      const tx = await instance[methodName](...args, {
        gasLimit: DEFAULT_GAS_LIMIT,
        ...overrides
      })

      onTransactionResult(tx)
    } catch (err) {
      onError(err)
    }
  }

  const handleClose = () => {
    setData((prevData) => {
      const { onRetryCancel } = prevData.pendingInvokeArgs
      onRetryCancel && onRetryCancel()

      return {
        description: '',
        message: '',
        isError: false,
        pendingInvokeArgs: {}
      }
    })
  }

  return (
    <TxPosterContext.Provider
      value={{
        writeContract,
        contractRead
      }}
    >
      {children}
      <ForceTxModal
        isOpen={data.isError}
        onClose={handleClose}
        message={data.message}
        description={data.description}
        handleContinue={handleContinue}
      />
    </TxPosterContext.Provider>
  )
}

const ForceTxModal = ({
  isOpen,
  onClose,
  message,
  description,
  handleContinue
}) => {
  return (
    <ModalRegular isOpen={isOpen} onClose={onClose}>
      <ModalWrapper className='max-w-2xl bg-FEFEFF'>
        <Dialog.Title className='flex items-center'>
          <div className='mb-4 text-lg font-semibold text-black'>
            EVM Error Occurred While Processing Your Request
          </div>
        </Dialog.Title>

        <div className='overflow-y-auto text-sm break-all max-h-54'>
          <div className='mb-5'>
            <p className='leading-5 text-404040'>
              We attempted to submit your transaction but ran into an unexpected
              error. The smart contract sent the following error message:
            </p>
          </div>

          <div className='mb-5'>
            <p className='text-940000'>{message}</p>
          </div>

          <div className='mb-4 text-940000'>
            <p className='break-words whitespace-pre-wrap'>{description}</p>
          </div>
        </div>

        <Divider className='mt-0 mb-4' />

        <div className='mb-5'>
          <p className='text-sm leading-5 text-404040'>
            While we do not suggest it, you may force this transaction to be
            sent nonetheless.
          </p>
        </div>

        <div className='flex flex-col justify-end sm:flex-row'>
          <button
            className='w-full p-3 mb-4 font-medium tracking-wide uppercase border rounded sm:mb-0 sm:mr-6 sm:w-auto border-9B9B9B text-9B9B9B hover:bg-9B9B9B hover:bg-opacity-10'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='w-full p-3 font-medium tracking-wide text-white uppercase rounded sm:w-auto bg-E52E2E'
            onClick={handleContinue}
          >
            Send Transaction Ignoring This Error
          </button>
        </div>
      </ModalWrapper>
    </ModalRegular>
  )
}
