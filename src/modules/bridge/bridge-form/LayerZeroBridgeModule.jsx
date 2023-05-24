import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import DownArrow from '@/icons/DownArrow'
import { chains } from '@/lib/connect-wallet/config/chains'
import {
  DestinationBalanceError,
  useBalance
} from '@/modules/bridge/bridge-form/DestinationBalanceError'
import { getSumInDollars } from '@/modules/bridge/bridge-form/getSumInDollars'
import { NetworkSelect } from '@/modules/bridge/bridge-form/NetworkSelect'
import {
  TransferAmountInput
} from '@/modules/bridge/bridge-form/TransferAmountInput'
import * as lzConfig from '@/src/config/bridge/layer-zero'
import { LayerZeroChainIds } from '@/src/config/bridge/layer-zero'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useLayerZeroBridge } from '@/src/hooks/useLayerZeroBridge'
import {
  convertFromUnits,
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { getNetworkInfo } from '@/utils/network'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'

// const SLIPPAGE_MULTIPLIER = 1_000_000
// const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export const LayerZeroBridgeModule = ({
  setButtonText,
  setButtonDisabled,
  btnClickValue,
  setInfoArray,
  selectedBridge,
  sendAmount,
  setSendAmount,
  receiverAddress,
  selectedNetworks,
  setSelectedNetworks,
  conversionRates,
  setTotalPriceInUsd
}) => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const { isTestNet } = getNetworkInfo(networkId)

  const tokenData = isTestNet ? lzConfig.TESTNET_TOKENS : lzConfig.MAINNET_TOKENS
  const tokenSymbol = 'NPM'

  const filteredNetworks = useMemo(() => {
    const _networks = isTestNet ? networks.testnet : networks.mainnet
    const filtered = _networks
      .filter(n => Object.keys(tokenData).includes(n.chainId.toString())) // filtered based on availability of tokens

    return filtered
  }, [isTestNet, tokenData])
  const bridgeContractAddress = lzConfig.BRIDGE_CONTRACTS[networkId]

  const [estimation, setEstimation] = useState(null)

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
    getEstimatedDestGas,
    estimating: calculatingFee,
    getEstimatedCurrentChainGas,
    chainGasPrice
  } = useLayerZeroBridge({
    bridgeContractAddress,
    tokenAddress: sourceTokenAddress,
    tokenSymbol,
    tokenDecimal: sourceTokenDecimals
  })

  useEffect(() => {
    const options = networks[getNetworkInfo(networkId).isMainNet ? 'mainnet' : 'testnet']
    setSelectedNetworks((prev) => ({ ...prev, network1: options.find(x => x.chainId === parseInt(networkId)) }))
    // eslint-disable-next-line
  }, [networkId])

  const debouncedAmount = useDebounce(convertToUnits(sendAmount || '0', sourceTokenDecimals).toString(), 1000)

  const updateEstimation = useCallback(async function () {
    const _estimation = await getEstimatedDestGas(
      debouncedAmount,
      _receiverAddress,
      LayerZeroChainIds[destChainId]
    )
    setEstimation(_estimation)

    const currentChainGas = await getEstimatedCurrentChainGas(
      convertToUnits(sendAmount, sourceTokenDecimals).toString()
    )
    if (currentChainGas) setEstimation(_prev => ({ ..._prev, currentChainGas }))

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

  const handleBridgeClick = async () => {
    if (canBridge) {
      await updateEstimation()

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
    calculatingFee ||
    (canBridge && receiverAddress && !isValidAddress) ||
    convertToUnits(sendAmount, sourceTokenDecimals).isGreaterThan(destinationBalance)

  useEffect(() => {
    if (selectedBridge !== 'layer-zero') return

    setButtonText(canBridge ? 'Bridge' : `Approve ${tokenSymbol}`)
    setButtonDisabled(buttonDisabled)
    // eslint-disable-next-line
    }, [canBridge, tokenSymbol, buttonDisabled, selectedBridge])

  useEffect(() => {
    if (selectedBridge !== 'layer-zero') return

    if (btnClickValue) handleBridgeClick()
    // eslint-disable-next-line
  }, [btnClickValue, selectedBridge])

  useEffect(() => {
    const formattedReceiveAmount = formatCurrency(sendAmount, locale, tokenSymbol, true)

    const formattedChainGasPriceInGwei = formatCurrency(
      convertFromUnits(chainGasPrice, 9),
      locale,
      'Gwei',
      true
    )

    const formattedNativeFee = formatCurrency(
      convertFromUnits(estimation?.nativeFee || '0', srcChainConfig.nativeCurrency.decimals),
      locale,
      srcChainConfig.nativeCurrency.symbol,
      true
    )

    const formattedCurrentGasChainPrice = formatCurrency(
      convertFromUnits(estimation?.currentChainGas || '0', srcChainConfig.nativeCurrency.decimals),
      locale,
      srcChainConfig.nativeCurrency.symbol,
      true
    )

    const totalPrice = getSumInDollars({
      rates: conversionRates,
      amounts: [
        {
          token: srcChainConfig.nativeCurrency.symbol,
          value: convertFromUnits(estimation?.nativeFee || '0', srcChainConfig.nativeCurrency.decimals).toString(),
          decimals: srcChainConfig.nativeCurrency.decimals
        },
        {
          token: srcChainConfig.nativeCurrency.symbol,
          value: convertFromUnits(estimation?.currentChainGas || '0', srcChainConfig.nativeCurrency.decimals).toString(),
          decimals: srcChainConfig.nativeCurrency.decimals
        },
        {
          token: srcChainConfig.nativeCurrency.symbol,
          value: 0,
          decimals: destinationTokenDecimals
        }
      ]
    })

    setTotalPriceInUsd(totalPrice)

    setInfoArray([
      {
        key: 'Receive (estimated)',
        value: formattedReceiveAmount.short,
        bold: true
      },
      {
        key: `Current Chain Gas Fee (${formattedChainGasPriceInGwei.short})`,
        value: formattedCurrentGasChainPrice.short,
        loading: calculatingFee,
        info: (
          <>
            Estimated gas fee for current chain is {formattedCurrentGasChainPrice.long}.<br />
            <i>(Network Gas Fee: {formattedChainGasPriceInGwei.long})</i>
          </>
        )
      },
      {
        key: 'Destination Chain Gas Fee',
        value: formattedNativeFee.short,
        loading: calculatingFee,
        info: `Estimated gas fee for destination chain is ${formattedNativeFee.long}`
      },
      {
        key: 'Bridge Fee (0%)',
        value: 0,
        info: 'Bridge fee amount'
      }
    ])
    // eslint-disable-next-line
  }, [calculatingFee, sendAmount, tokenSymbol, chainGasPrice, estimation, locale, srcChainConfig])

  if (selectedBridge !== 'layer-zero') return <></>

  return (
    <div className='flex-grow p-4 lg:p-8 lg:max-w-450'>
      <h1 className='text-xl font-semibold lg:text-display-xs'>LayerZero Bridge</h1>

      <div className='relative mt-4'>
        <TransferAmountInput
          balance={balance}
          tokenDecimals={sourceTokenDecimals}
          tokenSymbol={tokenSymbol}
          value={sendAmount}
          onChange={(val) => setSendAmount(val)}
        />

        {/* <AddressInput
          value={receiverAddress}
          onChange={setReceiverAddress}
          className='mt-2.5'
          placeholder="Enter Receiver's Wallet Address"
        /> */}

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

        <DestinationBalanceError
          tokenSymbol={tokenSymbol}
          tokenDecimals={destinationTokenDecimals}
          balance={destinationBalance}
          transferAmount={sendAmount ? convertToUnits(sendAmount, sourceTokenDecimals).toString() : ''}
          className='mt-4'
        />

        {/* {!active && (
          <div className='absolute inset-0 w-full h-full bg-white bg-opacity-50' />
        )} */}
      </div>
    </div>
  )
}