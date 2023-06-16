import { useEffect } from 'react'

import { useRouter } from 'next/router'

import DownArrow from '@/icons/DownArrow'
import { chains } from '@/lib/connect-wallet/config/chains'
import { getSumInDollars } from '@/modules/bridge/bridge-form/getSumInDollars'
import { NetworkSelect } from '@/modules/bridge/bridge-form/NetworkSelect'
import {
  TransferAmountInput
} from '@/modules/bridge/bridge-form/TransferAmountInput'
import { BRIDGE_KEYS } from '@/src/config/bridge'
import { useNetwork } from '@/src/context/Network'
import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'

const CelerApiError = ({ message, className = '' }) => {
  if (!message) { return null }

  const splitted = message.split(': ')

  return (
    <div
      className={classNames(
        'rounded-1 border border-E52E2E border-l-4 pt-3 pr-2 pb-4 pl-4 bg-E52E2E bg-opacity-5 text-E52E2E text-sm',
        className
      )}
    >
      {splitted.length > 1
        ? (
          <>
            <span className='mt-2 font-bold'>{splitted[0]}: </span> <span>{splitted.slice(1).join(': ')}</span>
          </>
          )
        : message}
    </div>
  )
}

export const CelerBridgeModule = ({
  celerHookResult,
  setInfoArray,
  selectedBridge,
  sendAmount,
  setSendAmount,
  selectedNetworks,
  setSelectedNetworks,
  conversionRates,
  setTotalPriceInUsd
}) => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()

  const {
    balance,
    estimating,
    chainGasPrice,

    tokenSymbol,
    sourceTokenDecimal,
    destinationTokenDecimal,

    filteredNetworks,

    balanceError,
    estimation
  } = celerHookResult

  const srcChainConfig = chains.find(x => { return x.chainId === `0x${(networkId).toString(16)}` })

  useEffect(() => {
    const formattedReceiveAmount = formatCurrency(
      convertFromUnits(estimation?.estimated_receive_amt || '0', destinationTokenDecimal),
      locale,
      tokenSymbol,
      true
    )

    const protocolFee = estimation.protocolFee
    const formattedProtocolFee = formatCurrency(protocolFee, locale, tokenSymbol, true)

    const currentChainGasFee = convertFromUnits(estimation?.estimated_receive_amt || '0', destinationTokenDecimal).isGreaterThan(0)
      ? convertFromUnits(estimation?.currentChainGas || '0', srcChainConfig.nativeCurrency.decimals).toString()
      : '0'
    const formattedCurrentChainGas = formatCurrency(currentChainGasFee, locale, srcChainConfig.nativeCurrency.symbol, true)

    const baseFee = convertFromUnits(estimation?.base_fee || '0', destinationTokenDecimal).toString()
    const formattedBaseFee = formatCurrency(baseFee, locale, tokenSymbol, true)

    const totalPrice = getSumInDollars({
      rates: conversionRates,
      amounts: [
        {
          token: srcChainConfig.nativeCurrency.symbol,
          value: currentChainGasFee,
          decimals: srcChainConfig.nativeCurrency.decimals
        },
        {
          token: tokenSymbol,
          value: baseFee,
          decimals: destinationTokenDecimal
        },
        {
          token: tokenSymbol,
          value: protocolFee,
          decimals: destinationTokenDecimal
        }
      ]
    })
    setTotalPriceInUsd(totalPrice)

    const formattedChainGasPriceInGwei = formatCurrency(
      convertFromUnits(chainGasPrice, 9),
      locale,
      'Gwei',
      true
    )

    setInfoArray([
      {
        key: 'Receive (estimated)',
        value: formattedReceiveAmount.short,
        title: formattedReceiveAmount.long,
        bold: true,
        loading: estimating
      },
      {
        key: `Current Chain Gas Fee (${formattedChainGasPriceInGwei.short})`,
        value: formattedCurrentChainGas.short,
        title: formattedCurrentChainGas.long,
        loading: estimating,
        info: (
          <>
            Estimated Gas fee for current chain is {formattedCurrentChainGas.long}.
            <i>(Network Gas Fee: {formattedChainGasPriceInGwei.long})</i>
          </>
        )
      },
      {
        key: 'Base Fee',
        value: formattedBaseFee.short,
        title: formattedBaseFee.long,
        loading: estimating,
        info: 'Base Fee is used to cover the gas cost for sending your transfer on the destination chain.'
      },
      {
        key: estimating || toBNSafe(estimation.protocolFeePercent).isLessThanOrEqualTo(0) ? 'Protocol Fee' : `Protocol Fee (${toBNSafe(estimation.protocolFeePercent).decimalPlaces(4).toString()}%)`,
        value: formattedProtocolFee.short,
        title: formattedProtocolFee.long,
        info: 'Protocol Fee is charged proportionally to your transfer amount. Protocol Fee is paid to cBridge LPs and Celer SGN as economic incentives.'
      }
    ])
    // eslint-disable-next-line
  }, [estimating, chainGasPrice, destinationTokenDecimal, estimation, locale, srcChainConfig, tokenSymbol, conversionRates, sendAmount])

  if (selectedBridge && selectedBridge !== BRIDGE_KEYS.CELER) { return <></> }

  return (
    <div className='flex-grow p-4 lg:p-8 lg:max-w-450'>
      <h1 className='text-xl font-semibold lg:text-display-xs'>Celer Bridge</h1>

      <div className='relative mt-4'>
        <TransferAmountInput
          balance={balance}
          tokenDecimals={sourceTokenDecimal}
          tokenSymbol={tokenSymbol}
          value={sendAmount}
          onChange={(val) => { return setSendAmount(val) }}
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
            options={filteredNetworks.filter(n => { return n.chainId.toString() !== networkId.toString() })}
            onChange={(val) => { return setSelectedNetworks((prev) => { return { ...prev, destNetwork: val } }) }}
          />
        </div>

        <CelerApiError className='mt-4' message={balanceError} />
      </div>
    </div>
  )
}
