import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { t, Trans } from '@lingui/macro'

import { ReportingHero } from '@/modules/reporting/ReportingHero'

import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useNetwork } from '@/src/context/Network'
import { Routes } from '@/src/config/routes'

import DateLib from '@/lib/date/DateLib'

import { classNames } from '@/utils/classnames'
import { convertFromUnits } from '@/utils/bn'
import { fromNow } from '@/utils/formatter/relative-time'
import { truncateAddress } from '@/utils/address'

import { Table, TableWrapper, THead } from '@/common/Table/Table'
import { Container } from '@/common/Container/Container'
import { Badge, identifyStatus } from '@/common/CardStatusBadge'
import { isValidProduct } from '@/src/helpers/cover'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'

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

const columns = [
  {
    name: t`reporter`,
    align: 'left',
    renderHeader
  },
  {
    name: t`date and time`,
    align: 'left',
    renderHeader
  },
  {
    name: t`total attested stake`,
    align: 'right',
    renderHeader
  },
  {
    name: t`total refuted stake`,
    align: 'right',
    renderHeader
  },
  {
    name: t`status`,
    align: 'right',
    renderHeader
  }
]

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
  const { push } = useRouter()
  const { networkId } = useNetwork()
  const [reports, setReports] = useState([])
  const fetchReports = useSubgraphFetch('ReportListing')

  const isDiversified = isValidProduct(productKey)
  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()
  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)

  useEffect(() => {
    if (!coverKey) {
      return
    }

    fetchReports(networkId, getQuery(coverKey, productKey))
      .then((_data) => {
        if (!_data) return
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
    push(Routes.ViewReport(coverKey, productKey, timestamp))
  }

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }

  return (
    <>
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        coverOrProductData={coverOrProductData}
      />
      <hr className='border-B0C4DB' />
      <Container className='pt-16 pb-36'>
        <TableWrapper>
          <Table>
            <THead
              theadClass='bg-white text-[#9B9B9B] font-poppins border-b-[1px] border-[#DAE2EB]'
              columns={columns}
            />
            <tbody className='divide-y divide-DAE2EB'>
              {reports.map((report, i) => (
                <tr
                  onClick={() => goTo(report.id)}
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
                      {fromNow(report.incidentDate)}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    {convertFromUnits(report.totalAttestedStake)
                      .decimalPlaces(0)
                      .toNumber()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    {convertFromUnits(report.totalRefutedStake)
                      .decimalPlaces(0)
                      .toNumber()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Badge
                      className='rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
                      status={identifyStatus(report.status)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Container>
    </>
  )
}

export default ReportListing
