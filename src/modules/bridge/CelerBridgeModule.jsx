import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Container } from '@/common/Container/Container'
import DownArrow from '@/icons/DownArrow'
import { AddressInput } from '@/modules/bridge/AddressInput'
import { InfoPanel } from '@/modules/bridge/InfoPanel'
import { NetworkSelect } from '@/modules/bridge/NetworkSelect'
import { TransferAmountInput } from '@/modules/bridge/TransferAmountInput'
import { WalletNotConnected } from '@/modules/bridge/WalletNotConnected'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useCelerBridge } from '@/src/hooks/useCelerBridge'
import { useDebounce } from '@/src/hooks/useDebounce'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import {
  convertFromUnits,
  convertToUnits,
  toBN,
  toBNSafe
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'

const SLIPPAGE_MULTIPLIER = 1_000_000
const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export const CelerBridgeModule = ({ bridgeContractAddress, tokenData, tokenSymbol, filteredNetworks }) => {
  const [sendAmount, setSendAmount] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState({
    network1: null,
    network2: null
  })
  const [estimation, setEstimation] = useState(null)
  const [estimationLoading, setEstimationLoading] = useState(false)

  const { locale } = useRouter()
  const { networkId } = useNetwork()
  const { active, account } = useWeb3React()

  const sourceTokenAddress = tokenData[networkId].address
  const sourceTokenDecimals = tokenData[networkId].decimal

  const destinationTokenData = selectedNetworks?.network2?.chainId ? tokenData[selectedNetworks?.network2?.chainId] : {}
  // const destinationTokenAddress = destinationTokenData.address || ''
  const destinationTokenDecimals = destinationTokenData?.decimal || 1

  const {
    balance,
    allowance,
    handleApprove,
    handleBridge,
    approving,
    bridging,
    getEstimation,
    estimating: calculatingFee
  } = useCelerBridge({
    bridgeContractAddress,
    tokenAddress: sourceTokenAddress,
    tokenSymbol,
    tokenDecimal: sourceTokenDecimals
  })

  useEffect(() => {
    const options = networks[getNetworkInfo(networkId).isMainNet ? 'mainnet' : 'testnet']
    setSelectedNetworks((prev) => ({ ...prev, network1: options.find(x => x.chainId === parseInt(networkId)) }))
  }, [networkId])

  const debouncedAmount = useDebounce(convertToUnits(sendAmount || '0', sourceTokenDecimals).toString(), 1000)
  const srcChainId = selectedNetworks?.network1?.chainId
  const destChainId = selectedNetworks?.network2?.chainId
  const _receiverAddress = receiverAddress || account

  const updateEstimation = useCallback(async function () {
    setEstimationLoading(true)
    const _estimation = await getEstimation(
      debouncedAmount,
      _receiverAddress,
      srcChainId,
      destChainId,
      SLIPPAGE
    )
    setEstimation(_estimation)
    setEstimationLoading(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_receiverAddress, debouncedAmount, destChainId, srcChainId])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  const canApprove =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimals).isLessThanOrEqualTo(balance) &&
    convertToUnits(sendAmount, sourceTokenDecimals).isGreaterThan(allowance)

  const canBridge =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimals).isLessThanOrEqualTo(allowance)

  const isValidAddress = isAddress(receiverAddress || account)
  const formattedReceiveAmount = formatCurrency(
    convertFromUnits(
      estimation?.estimated_receive_amt || '0', destinationTokenDecimals)
    , locale, tokenSymbol, true)

  const handleBridgeClick = async () => {
    await updateEstimation()

    if (canBridge) {
      await handleBridge(
        convertToUnits(sendAmount, sourceTokenDecimals).toString(),
        selectedNetworks.network2,
        receiverAddress || account,
        estimation.max_slippage
      )
      return
    }

    if (canApprove) {
      handleApprove(
        convertToUnits(sendAmount, sourceTokenDecimals).toString()
      )
    }
  }

  const buttonDisabled =
    !(canApprove || canBridge) ||
    approving ||
    bridging ||
    (canBridge && receiverAddress && !isValidAddress)

  return (
    <Container className='pb-16'>
      <div className='p-8 mx-auto bg-white border border-B0C4DB rounded-2xl max-w-450'>
        <h1 className='font-semibold text-display-xs'>Celer Bridge</h1>

        <div className='relative mt-4'>
          <TransferAmountInput
            balance={balance}
            tokenDecimals={sourceTokenDecimals}
            tokenSymbol={tokenSymbol}
            value={sendAmount}
            onChange={(val) => setSendAmount(val)}
          />

          <AddressInput
            value={receiverAddress}
            onChange={setReceiverAddress}
            className='mt-2.5'
            placeholder="Enter Receiver's Wallet Address"
          />

          <div className='relative mt-4'>

            <NetworkSelect
              label='From'
              selected={selectedNetworks.network1}
              defaultChain={parseInt(networkId)}
              onChange={() => {}}
              disabled
            />

            <i className='absolute flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full top-1/2 left-1/2'>
              <DownArrow className='w-5 h-5 text-4E7DD9' />
            </i>

            <NetworkSelect
              label='To'
              className='mt-2.5'
              selected={selectedNetworks.network2}
              options={filteredNetworks.filter(n => n.chainId.toString() !== networkId.toString())}
              onChange={(val) =>
                setSelectedNetworks((prev) => ({ ...prev, network2: val }))}
            />
          </div>

          <InfoPanel
            className='mt-4'
            infoArray={[
              { key: 'Receive (estimated)', value: formattedReceiveAmount.long, bold: true, loading: estimationLoading },
              {
                key: 'Minimum Receive',
                value: estimation
                  ? toBN(sendAmount).minus(
                    toBN(sendAmount).multipliedBy(estimation.max_slippage).dividedBy(SLIPPAGE_MULTIPLIER)
                  ).toString()
                  : '0',
                loading: estimationLoading,
                bold: true
              },
              {
                key: 'Estimated Fee',
                value: 'N/A',
                loading: calculatingFee
              }
            ]}
          />

          {!active && (
            <div className='absolute inset-0 w-full h-full bg-white bg-opacity-50' />
          )}
        </div>

        {!active
          ? (
            <WalletNotConnected className='mt-4' />
            )
          : (
            <RegularButton
              className='w-full p-4 mt-4 font-semibold uppercase rounded-big text-md'
              onClick={handleBridgeClick}
              disabled={buttonDisabled}
            >
              {canBridge ? 'Bridge' : `Approve ${tokenSymbol}`}
            </RegularButton>
            )}
      </div>
    </Container>
  )
}
