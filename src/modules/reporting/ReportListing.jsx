import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import {
  Badge,
  identifyStatus
} from '@/common/CardStatusBadge'
import { Container } from '@/common/Container/Container'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import {
  Table,
  TableWrapper,
  THead
} from '@/common/Table/Table'
import DateLib from '@/lib/date/DateLib'
import { ReportingHero } from '@/modules/reporting/ReportingHero'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { truncateAddress } from '@/utils/address'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

/**
 *
 * @param {string} coverKey
 * @param {string} productKey
 * @returns
 */
const getQuery = function (coverKey, productKey) {
  return `{
    incidentReports(
      skip: 0
      orderBy: incidentDate
      orderDirection: desc
      where:{
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      }
    ) {
      id
      coverKey
      productKey
      incidentDate
      resolved
      status
      totalAttestedStake
      totalRefutedStake
      reporter
    }
  }`
}

/**
 *
 * @param {{name: string, align: string}} col
 * @returns
 */
function renderHeader (col) {
  return (
    <th
      scope='col'
      className={classNames(
        'px-6 pt-6 pb-2 font-bold text-xs uppercase whitespace-nowrap',
        col.align === 'right' ? 'text-right' : 'text-left'
      )}
    >
      {col.name}
    </th>
  )
}

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function}>} An array of column objects.
 */
const getColumns = (i18n) => {
  return [
    {
      id: 'reporter',
      name: t(i18n)`reporter`,
      align: 'left',
      renderHeader
    },
    {
      id: 'date and time',
      name: t(i18n)`date and time`,
      align: 'left',
      renderHeader
    },
    {
      id: 'total attested stake',
      name: t(i18n)`total attested stake`,
      align: 'right',
      renderHeader
    },
    {
      id: 'total refuted stake',
      name: t(i18n)`total refuted stake`,
      align: 'right',
      renderHeader
    },
    {
      id: 'status',
      name: t(i18n)`status`,
      align: 'right',
      renderHeader
    }
  ]
}

/**
 *
 * @param {Object} props
 * @param {string} props.coverKey
 * @param {string} props.productKey
 * @param {string} props.locale
 * @returns
 */
const ReportListing = (props) => {
  const { coverKey, productKey, locale } = props
  const router = useRouter()
  const { networkId } = useNetwork()
  const [reports, setReports] = useState([])
  const fetchReports = useSubgraphFetch('ReportListing')

  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()

  const isDiversified = isValidProduct(productKey)
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  const { i18n } = useLingui()

  const columns = getColumns(i18n)

  useEffect(() => {
    if (!coverKey) {
      return
    }

    fetchReports(networkId, getQuery(coverKey, productKey))
      .then((_data) => {
        if (!_data) { return }
        setReports(_data.incidentReports)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [coverKey, productKey, networkId, fetchReports])

  /**
   *
   * @param {string} reportId
   */
  function goTo (reportId) {
    const [, , timestamp] = reportId.split('-')
    router.push(Routes.ViewReport(coverKey, productKey, timestamp))
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!coverOrProductData) {
    return (
      <NoDataFound />
    )
  }

  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  return (
    <>
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        coverOrProductData={coverOrProductData}
        projectOrProductName={projectOrProductName}
      />
      <hr className='border-B0C4DB' />
      <Container className='pt-16 pb-36'>
        <TableWrapper>
          <Table>
            <THead
              theadClass='bg-white text-[#9B9B9B] border-b-[1px] border-[#DAE2EB]'
              columns={columns}
            />
            <tbody className='divide-y divide-DAE2EB'>
              {reports.map((report, i) => {
                const formattedTotalAttestedStake = formatCurrency(
                  convertFromUnits(report.totalAttestedStake, NPMTokenDecimals),
                  router.locale,
                  NPMTokenSymbol,
                  true
                )
                const formattedTotalRefutedStake = formatCurrency(
                  convertFromUnits(report.totalRefutedStake, NPMTokenDecimals),
                  router.locale,
                  NPMTokenSymbol,
                  true
                )

                return (
                  <tr
                    onClick={() => { return goTo(report.id) }}
                    className='cursor-pointer hover:bg-F4F8FC'
                    key={i}
                  >
                    <td className='px-6 py-4 text-sm max-w-180'>
                      <span className='w-max' title={report.reporter}>
                        {truncateAddress(report.reporter)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm max-w-180'>
                      <span
                        className='w-max'
                        title={DateLib.toLongDateFormat(
                          report.incidentDate,
                          locale
                        )}
                      >
                        {fromNow(report.incidentDate, router.locale)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right' title={formattedTotalAttestedStake.long}>
                      {formattedTotalAttestedStake.short}
                    </td>
                    <td className='px-6 py-4 text-right' title={formattedTotalRefutedStake.long}>
                      {formattedTotalRefutedStake.short}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Badge
                        className='rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
                        status={identifyStatus(report.status)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </>
  )
}

export default ReportListing
