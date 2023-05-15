import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Container } from '@/common/Container/Container'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { Label } from '@/common/Label/Label'
import {
  ReceiveAmountInput
} from '@/common/ReceiveAmountInput/ReceiveAmountInput'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import DateLib from '@/lib/date/DateLib'
import { POOL_URLS } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import {
  getAnnualDiscountRate,
  getDiscountedPrice
} from '@/src/helpers/bond'
import { useBondInfo } from '@/src/hooks/useBondInfo'
import { useCreateBond } from '@/src/hooks/useCreateBond'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useTokenSymbol } from '@/src/hooks/useTokenSymbol'
import { BondInfoCard } from '@/src/modules/pools/bond/BondInfoCard'
import { mergeAlternatively } from '@/utils/arrays'
import {
  convertFromUnits,
  convertToUnits,
  sumOf
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { getReplacedString } from '@/utils/string'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

const BondPage = () => {
  const { networkId } = useNetwork()
  const { info, refetch: refetchBondInfo } = useBondInfo()
  const [value, setValue] = useState('')
  const { account } = useWeb3React()
  const lpTokenAddress = info.lpTokenAddress
  const lpTokenSymbol = useTokenSymbol(lpTokenAddress)
  const lpTokenDecimals = useTokenDecimals(lpTokenAddress)
  const {
    NPMTokenAddress,
    liquidityTokenAddress,
    liquidityTokenDecimals,
    NPMTokenSymbol,
    getPriceByAddress,
    NPMTokenDecimals
  } = useAppConstants()
  const router = useRouter()

  const {
    balance,
    loadingBalance,
    receiveAmount,
    receiveAmountLoading,
    approving,
    loadingAllowance,
    bonding,
    canBond,
    error,
    handleApprove,
    handleBond
  } = useCreateBond({ info: { ...info, lpTokenSymbol }, value, refetchBondInfo })

  const roi = getAnnualDiscountRate(info.discountRate, info.vestingTerm)
  const marketPrice = convertToUnits(
    getPriceByAddress(NPMTokenAddress),
    NPMTokenDecimals
  ).toString()

  const leftHalf = [
    {
      title: t`Bond Price`,
      value: formatCurrency(
        getDiscountedPrice(
          info.discountRate,
          convertFromUnits(marketPrice, liquidityTokenDecimals).toString()
        ),
        router.locale,
        'USD'
      ).short,
      tooltip: getDiscountedPrice(
        info.discountRate,
        convertFromUnits(marketPrice, liquidityTokenDecimals).toString()
      ),
      valueClasses: 'text-display-xs text-4E7DD9 mt-1'
    },
    {
      title: t`Maximum Bond`,
      value: `${
        formatCurrency(
          convertFromUnits(info.maxBond, NPMTokenDecimals).toString(),
          router.locale,
          NPMTokenSymbol,
          true
        ).short
      }`,
      tooltip: `${
        formatCurrency(
          convertFromUnits(info.maxBond, NPMTokenDecimals).toString(),
          router.locale,
          NPMTokenSymbol,
          true
        ).long
      }`,
      valueClasses: 'text-sm text-9B9B9B mt-1',
      titleClasses: 'mt-7'
    }
  ]

  const rightHalf = [
    {
      title: t`Market Price`,
      value: formatCurrency(
        convertFromUnits(marketPrice, liquidityTokenDecimals).toString(),
        router.locale,
        'USD'
      ).short,
      tooltip: convertFromUnits(marketPrice, liquidityTokenDecimals).toString(),
      valueClasses: 'text-display-xs text-9B9B9B mt-1'
    }
  ]

  const claimable = convertFromUnits(
    info.claimable,
    NPMTokenDecimals
  ).isGreaterThan(0)

  if (account) {
    rightHalf.push({
      title: t`Your Bond`,
      value: claimable
        ? `${
            formatCurrency(
              convertFromUnits(info.claimable, NPMTokenDecimals).toString(),
              router.locale,
              NPMTokenSymbol,
              true
            ).short
          }`
        : '',
      tooltip: `${
        formatCurrency(
          convertFromUnits(info.claimable, NPMTokenDecimals).toString(),
          router.locale,
          NPMTokenSymbol,
          true
        ).long
      }`,
      titleClasses: 'mt-7',
      valueClasses: 'text-sm text-9B9B9B mt-1'
    })
  }

  const details = mergeAlternatively(leftHalf, rightHalf, {
    title: '',
    value: '',
    tooltip: ''
  })

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setValue(val)
    }
  }

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance, lpTokenDecimals).toString())
  }

  const unlockTimestamp = sumOf(DateLib.unix(), info?.vestingTerm || '0')
  let loadingMessage = ''
  if (receiveAmountLoading) {
    loadingMessage = t`Calculating tokens...`
  } else if (loadingBalance) {
    loadingMessage = t`Fetching balance...`
  } else if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`
  }

  return (
    <Container
      className='grid grid-cols-1 pt-16 sm:gap-16 lg:grid-cols-3 pb-36'
    >
      <div className='max-w-lg col-span-2'>
        <TokenAmountInput
          labelText={t`Enter your amount`}
          inputValue={value}
          tokenBalance={balance}
          tokenSymbol={lpTokenSymbol}
          tokenAddress={lpTokenAddress}
          tokenDecimals={lpTokenDecimals}
          inputId='bond-amount'
          onChange={handleChange}
          disabled={approving || bonding}
          handleChooseMax={handleChooseMax}
          data-testid='bond-amount-input'
        />
        {error && <p className='px-3 text-FA5C2F'>{error}</p>}
        <div className='mt-16 receive'>
          <ReceiveAmountInput
            labelText={t`You will receive`}
            tokenSymbol={NPMTokenSymbol}
            inputValue={convertFromUnits(receiveAmount).toString()}
            data-testid='receive-amount-input'
          />
        </div>

        <div className='unlock mt-14'>
          <Label className='mb-2' htmlFor='unlock-on'>
            <Trans>Will Unlock On</Trans>
          </Label>
          <p
            id='unlock-on'
            className='text-lg font-medium text-7398C0'
            title={DateLib.toLongDateFormat(unlockTimestamp, router.locale)}
          >
            {fromNow(unlockTimestamp)}
          </p>
        </div>

        <div className='mt-4'>
          <DataLoadingIndicator message={loadingMessage} />
          {!canBond
            ? (
              <RegularButton
                disabled={error || approving || !value || loadingMessage}
                className='w-full p-6 font-semibold uppercase'
                onClick={() => {
                  handleApprove()
                }}
              >
                {approving
                  ? (
                      t`Approving...`
                    )
                  : (
                    <>
                      <Trans>Approve</Trans> {lpTokenSymbol}
                    </>
                    )}
              </RegularButton>
              )
            : (
              <RegularButton
                disabled={error || bonding || loadingMessage}
                className='w-full p-6 font-semibold uppercase'
                onClick={() => {
                  handleBond(() => {
                    setValue('')
                  })
                }}
              >
                {bonding
                  ? (
                      t`Bonding...`
                    )
                  : (
                    <>
                      <Trans>Bond</Trans> {lpTokenSymbol}
                    </>
                    )}
              </RegularButton>
              )}
        </div>
      </div>
      <div className='row-start-1 mb-10 md:row-start-auto'>
        <div className='flex justify-end mb-10'>
          <a
            href={getReplacedString(POOL_URLS[networkId], {
              liquidityTokenAddress,
              NPMTokenAddress
            })}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className='inline-block mr-8 text-lg font-medium text-4E7DD9 hover:underline'
          >
            <Trans>Get LP tokens</Trans>
          </a>

          <Link href={Routes.BondTransactions}>
            <a className='inline-block text-lg font-medium text-4E7DD9 hover:underline'>
              <Trans>Transaction List</Trans>
            </a>
          </Link>
        </div>
        <BondInfoCard
          account={account}
          info={info}
          details={details}
          roi={roi}
          refetchBondInfo={refetchBondInfo}
        />
      </div>
    </Container>
  )
}

export default BondPage
