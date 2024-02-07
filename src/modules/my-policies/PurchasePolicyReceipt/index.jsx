import Link from 'next/link'
import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import DateLib from '@/lib/date/DateLib'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import {
  DescriptionComponent
} from '@/modules/my-policies/PurchasePolicyReceipt/DescriptionComponent'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { isValidProduct } from '@/src/helpers/cover'
import {
  useFetchCoverPurchasedEvent
} from '@/src/hooks/useFetchCoverPurchasedEvent'
import {
  convertFromUnits,
  sumOf,
  toBN
} from '@/utils/bn'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const PurchasePolicyReceipt = ({ txHash }) => {
  const router = useRouter()

  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()
  const { data: event, loading: eventLoading } = useFetchCoverPurchasedEvent({ txHash })

  const coverKey = event?.coverKey
  const productKey = event?.productKey

  const isDiversified = isValidProduct(productKey)
  const { loading: dataLoading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  const { i18n } = useLingui()

  if (dataLoading || eventLoading) {
    return (
      <Loading />
    )
  }

  if (!txHash || !event) {
    return <NoDataFound />
  }

  const purchaser = event.onBehalfOf
  const onBehalfOf = event.onBehalfOf

  const date = new Date(
    parseInt(event.blockTimestamp) * 1000
  ).toUTCString()
  const receiptNo = event.policyId

  const daysCovered = toBN(event.expiresOn)
    .minus(event.blockTimestamp)
    .dividedBy(24 * 60 * 60)
    .toString()

  const duration = event.coverDuration

  const rate = toBN(event.fee)
    .multipliedBy(365)
    .dividedBy(
      toBN(event.amountToCover).multipliedBy(
        Math.floor(parseFloat(daysCovered))
      )
    )
    .toString()

  const startsAt = DateLib.getEodInUTC(DateLib.fromUnix(sumOf(event.blockTimestamp, coverOrProductData.coverageLag)))

  const onBehalfOfData = [
    {
      label: 'Protection',
      value: formatCurrency(
        convertFromUnits(
          event.amountToCover,
          liquidityTokenDecimals
        ).toString(),
        router.locale,
        liquidityTokenSymbol,
        true
      ).long
    },
    {
      label: 'Premium Rate',
      value: formatPercent(rate, router.locale)
    },
    {
      label: 'Duration',
      value: `${duration} months`
    },
    {
      label: 'Start Date',
      value: DateLib.toLongDateFormat(startsAt, 'en-GB', '')
    },
    {
      label: 'End Date',
      value: DateLib.toLongDateFormat(event.expiresOn, 'en-GB', '')
    },
    {
      label: 'Cashback Code',
      value: safeParseBytes32String(event.referralCode) || '---'
    }
  ]

  const premuimPaid = formatCurrency(
    convertFromUnits(event.fee, liquidityTokenDecimals).toString(),
    router.locale,
    liquidityTokenSymbol,
    true
  ).long

  const about = isDiversified ? coverOrProductData?.productInfoDetails?.about : coverOrProductData?.coverInfoDetails?.about
  const parameters = isDiversified ? coverOrProductData?.productInfoDetails?.parameters : coverOrProductData?.coverInfoDetails?.parameters
  const exclusions = isDiversified ? coverOrProductData?.productInfoDetails?.exclusions : coverOrProductData?.coverInfoDetails?.exclusions
  const text = {
    policyInfo: about,
    coverRules: [
      'Carefully read the following terms and conditions. For a successful claim payout, all of the following points must be true.',
      <CoverParameters key='cover_params' textClassName='text-md sm:text-lg' parameters={parameters} titleClassName='text-md sm:text-lg font-bold mt-6 leading-5 mb-2 font-arial' />
    ],
    exclusions

  }

  const policyReceiptData = [
    {
      label: 'Date:',
      value: new Date(date).toUTCString(),
      valueClassName: 'break-words'
    },
    {
      label: 'Receipt no:',
      value: receiptNo,
      valueClassName: 'break-all'
    }, {
      label: 'Purchaser:',
      value: purchaser,
      valueClassName: 'break-all'
    }

  ]

  return (
    <div className='bg-white font-arial'>

      <div className='px-4 pt-4 m-auto sm:px-10 md:px-10 lg:max-w-5xl pb-52'>
        <div className='flex flex-col text-center cursor-pointer sm:flex-row mt-9'>

          <Link href={Routes.Home} replace className='sm:w-auto'>

            <picture>
              <img
                loading='lazy'
                alt={t(i18n)`Neptune Mutual`}
                srcSet='/logos/neptune-mutual-full-beta.svg'
                className='w-full text-black h-9'
                data-testid='header-logo'
              />
            </picture>

          </Link>
          <div className='flex-grow'> </div>
          <a
            href='https://neptunemutual.com'
            className='items-end mt-2 text-black'
          >
            neptunemutual.com
          </a>
        </div>

        <hr className='mt-4 mb-6 sm:mb-10' />

        <h1 className='mb-4 font-bold leading-9 text-md sm:mb-0 sm:text-display-md'>
          {projectOrProductName} Policy Receipt
        </h1>

        {
          policyReceiptData.map(({ label, value, valueClassName }, i) => {
            return (
              <div className='flex flex-col mt-2 leading-7 sm:flex-row sm:mt-4 text-md sm:text-lg' key={`${i}-${label}`}>
                <p className='mr-2 font-bold'>{label}</p>
                <p className={valueClassName}>{value}</p>
              </div>
            )
          })
        }

        <hr className='mt-6 sm:mt-12' />

        <div className='mt-6 sm:mt-10'>

          <div className='text-lg leading-6 mt-3.5 mb-4 sm:mb-10'>
            <p className='mb-2 mr-2 font-bold leading-7 text-md sm:text-display-xs'>On Behalf Of</p>
            <p className='break-all text-md sm:text-md'>{onBehalfOf}</p>
          </div>

          {onBehalfOfData.map(({ label, value }, i) => {
            return (
              <div
                key={i}
                className='flex flex-col gap-2 pb-4 leading-6 sm:flex-row sm:gap-0 text-md sm:text-lg'
              >
                <p className='font-bold leading-5 sm:flex-shrink-0 sm:w-1/2 md:w-full sm:max-w-60'>{label}</p>
                <div className='overflow-hidden'>{value}</div>
              </div>
            )
          })}

          <div className='flex flex-col gap-1 font-bold leading-6 sm:flex-row sm:gap-0 text-md sm:text-lg'>
            <p className='w-1/2 md:w-full max-w-60'>Premium Paid</p>
            <p className='uppercase'>{premuimPaid}</p>
          </div>

          <hr className='mt-6 sm:mt-12' />

          <div className='flex flex-col mt-6 leading-5 sm:flex-row sm:mt-10 text-md sm:text-lg'>
            <p className='flex-shrink-0 font-bold sm:w-1/2 md:w-full max-w-60'>Your {'cx' + liquidityTokenSymbol} Address</p>
            <div className='flex items-center mt-2 break-all sm:mt-0'>
              {event.cxToken}
            </div>
          </div>
          <div className='flex flex-col mt-4 leading-5 sm:flex-row sm:mt-6 text-md sm:text-lg'>
            <p className='flex-shrink-0 font-bold sm:w-1/2 md:w-full max-w-60'>Transaction Receipt</p>
            <div className='flex items-center mt-2 break-all sm:mt-0'>
              {txHash}
            </div>
          </div>
        </div>

        <hr className='my-6 sm:my-10' />

        <Alert printable>
          <p className='text-sm font-bold sm:text-lg text-E03636'>Beta Version Disclaimer</p>
          <p className='mt-1 text-sm sm:text-lg text-E03636 sm:leading-6'>As you are participating in the beta version of the Neptune Mutual protocol, it is possible that the terms and exclusions may change.</p>
        </Alert>

        <DescriptionComponent
          title='Cover Rules'
          text={text.coverRules}
          className='mt-6 sm:mt-13'
          bullets
        />

        <DescriptionComponent
          title='Exclusions'
          text={text.exclusions}
          className='mt-6'
          bullets
        />

        <StandardsTerms className='mt-8 text-lg' />
      </div>
    </div>
  )
}
