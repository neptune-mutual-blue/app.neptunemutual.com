import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import DownArrow from '@/icons/DownArrow'
import { chains } from '@/lib/connect-wallet/config/chains'
import {
  DestinationBalanceError
} from '@/modules/bridge/bridge-form/DestinationBalanceError'
import { getSumInDollars } from '@/modules/bridge/bridge-form/getSumInDollars'
import { NetworkSelect } from '@/modules/bridge/bridge-form/NetworkSelect'
import {
  TransferAmountInput
} from '@/modules/bridge/bridge-form/TransferAmountInput'
import { BRIDGE_KEYS } from '@/src/config/bridge'
import { LayerZeroChainIds } from '@/src/config/bridge/layer-zero'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import {
  convertFromUnits,
  convertToUnits
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'

// const SLIPPAGE_MULTIPLIER = 1_000_000
// const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export const LayerZeroBridgeModule = ({
  layerZeroHookResult,
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
  const [estimation, setEstimation] = useState(null)

  const {
    balance,
    chainGasPrice,
    estimating,
    getEstimatedDestGas,
    getEstimatedCurrentChainGas,
    sourceTokenDecimal,
    tokenSymbol,
    tokenData,
    filteredNetworks,

    destinationBalance
  } = layerZeroHookResult

  const srcChainConfig = chains.find(x => x.chainId === `0x${(networkId).toString(16)}`)
  const _receiverAddress = receiverAddress || account
  const destChainId = selectedNetworks?.destNetwork?.chainId
  const destinationTokenData = destChainId ? tokenData[destChainId] : {}
  const destinationTokenDecimals = destinationTokenData?.decimal || 1

  // const srcChainId = selectedNetworks?.srcNetwork?.chainId
  // const destinationTokenAddress = destinationTokenData.address || ''
  // const destinationBridgeAddress = BRIDGE_CONTRACTS[destChainId]

  const debouncedAmount = useDebounce(convertToUnits(sendAmount || '0', sourceTokenDecimal).toString(), 1000)

  const updateEstimation = useCallback(async function () {
    const _estimation = await getEstimatedDestGas(
      debouncedAmount,
      _receiverAddress,
      LayerZeroChainIds[destChainId]
    )
    setEstimation(_estimation)

    const currentChainGas = await getEstimatedCurrentChainGas(
      convertToUnits(sendAmount, sourceTokenDecimal).toString()
    )
    if (currentChainGas) setEstimation(_prev => ({ ..._prev, currentChainGas }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_receiverAddress, debouncedAmount, destChainId])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

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
        loading: estimating,
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
        loading: estimating,
        info: `Estimated gas fee for destination chain is ${formattedNativeFee.long}`
      },
      {
        key: 'Bridge Fee (0%)',
        value: 0,
        info: 'Bridge fee amount'
      }
    ])
    // eslint-disable-next-line
  }, [estimating, sendAmount, tokenSymbol, chainGasPrice, estimation, locale, srcChainConfig])

  if (selectedBridge !== BRIDGE_KEYS.LAYERZERO) return <></>

  return (
    <div className='flex-grow p-4 lg:p-8 lg:max-w-450'>
      <h1 className='text-xl font-semibold lg:text-display-xs'>LayerZero Bridge</h1>

      <div className='relative mt-4'>
        <TransferAmountInput
          balance={balance}
          tokenDecimals={sourceTokenDecimal}
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
            selected={selectedNetworks.srcNetwork}
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
            selected={selectedNetworks.destNetwork}
            options={filteredNetworks.filter(n => n.chainId.toString() !== networkId.toString())}
            onChange={(val) =>
              setSelectedNetworks((prev) => ({ ...prev, destNetwork: val }))}
          />
        </div>

        <DestinationBalanceError
          tokenSymbol={tokenSymbol}
          tokenDecimals={destinationTokenDecimals}
          balance={destinationBalance}
          transferAmount={sendAmount ? convertToUnits(sendAmount, sourceTokenDecimal).toString() : ''}
          className='mt-4'
        />

        {/* {!active && (
          <div className='absolute inset-0 w-full h-full bg-white bg-opacity-50' />
        )} */}
      </div>
    </div>
  )
}
