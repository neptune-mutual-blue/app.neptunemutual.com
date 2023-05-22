import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Container } from '@/common/Container/Container'
import DownArrow from '@/icons/DownArrow'
import { chains } from '@/lib/connect-wallet/config/chains'
import { AddressInput } from '@/modules/bridge/bridge-form/AddressInput'
import {
  DestinationBalanceError,
  useBalance
} from '@/modules/bridge/bridge-form/DestinationBalanceError'
import { InfoPanel } from '@/modules/bridge/bridge-form/InfoPanel'
import { NetworkSelect } from '@/modules/bridge/bridge-form/NetworkSelect'
import { TransferAmountInput } from '@/modules/bridge/bridge-form/TransferAmountInput'
import { WalletNotConnected } from '@/modules/bridge/bridge-form/WalletNotConnected'
import { LayerZeroChainIds } from '@/src/config/bridge/layer-zero'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useLayerZeroBridge } from '@/src/hooks/useLayerZeroBridge'
import { getNetworkInfo } from '@/utils/network'
import {
  convertFromUnits,
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'

// const SLIPPAGE_MULTIPLIER = 1_000_000
// const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export const LayerZeroBridgeModule = ({ bridgeContractAddress, tokenData, tokenSymbol, filteredNetworks }) => {
  const [sendAmount, setSendAmount] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState({
    network1: null,
    network2: null
  })
  const [estimation, setEstimation] = useState(null)

  const { locale } = useRouter()
  const { networkId } = useNetwork()
  const { active, account } = useWeb3React()

  const sourceTokenAddress = tokenData[networkId].address
  const sourceTokenDecimals = tokenData[networkId].decimal

  // const srcChainId = selectedNetworks?.network1?.chainId
  const destChainId = selectedNetworks?.network2?.chainId
  const _receiverAddress = receiverAddress || account

  const destinationTokenData = selectedNetworks?.network2?.chainId ? tokenData[selectedNetworks?.network2?.chainId] : {}
  // const destinationTokenAddress = destinationTokenData.address || ''
  const destinationTokenDecimals = destinationTokenData?.decimal || 1
  // const destinationBridgeAddress = BRIDGE_CONTRACTS[destChainId]

  const { balance: destinationBalance } = useBalance(destChainId)

  const {
    balance,
    allowance,
    handleApprove,
    handleBridge,
    approving,
    bridging,
    getEstimation,
    estimating: calculatingFee
  } = useLayerZeroBridge({
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

  const updateEstimation = useCallback(async function () {
    const _estimation = await getEstimation(
      debouncedAmount,
      _receiverAddress,
      LayerZeroChainIds[destChainId]
    )
    setEstimation(_estimation)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_receiverAddress, debouncedAmount, destChainId])

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

  const srcChainConfig = chains.find(x => x.chainId === `0x${(networkId).toString(16)}`)

  const formattedNativeFee = formatCurrency(
    convertFromUnits(estimation?.nativeFee || '0', srcChainConfig.nativeCurrency.decimals),
    locale,
    srcChainConfig.nativeCurrency.symbol,
    true
  )

  const handleBridgeClick = async () => {
    await updateEstimation()

    if (canBridge) {
      await handleBridge(
        convertToUnits(sendAmount, sourceTokenDecimals).toString(),
        LayerZeroChainIds[destChainId],
        receiverAddress || account
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
    (canBridge && receiverAddress && !isValidAddress) ||
    convertToUnits(sendAmount, sourceTokenDecimals).isGreaterThan(destinationBalance)

  return (
    <Container className='pb-16 mt-8'>
      <div className='p-8 mx-auto bg-white border border-B0C4DB rounded-2xl max-w-450'>
        <h1 className='font-semibold text-display-xs'>LayerZero Bridge</h1>

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
              {
                key: 'Estimated Fee',
                value: formattedNativeFee.long,
                loading: calculatingFee,
                bold: true
              },
              {
                key: 'Minimum receive',
                value: formatCurrency(sendAmount, 'en', tokenSymbol, true).short
              },
              {
                key: 'Receive (estimated)',
                value: formatCurrency(sendAmount, 'en', tokenSymbol, true).short
              }
            ]}
          />

          <DestinationBalanceError
            tokenSymbol={tokenSymbol}
            tokenDecimals={destinationTokenDecimals}
            balance={destinationBalance}
            transferAmount={sendAmount ? convertToUnits(sendAmount, sourceTokenDecimals).toString() : ''}
            className='mt-4'
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
