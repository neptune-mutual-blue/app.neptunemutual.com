import {
  Fragment,
  useEffect
} from 'react'

import { useRouter } from 'next/router'

import { useAppConstants } from '@/src/context/AppConstants'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export const ResolvedTBodyRow = ({
  columns = [],
  status,
  resolvedOn,
  report,
  coverOrProductData
}) => {
  const router = useRouter()
  const { setStatsByKey } = useSortableStats()
  const { NPMTokenSymbol } = useAppConstants()

  const {
    id,
    coverKey,
    productKey = safeFormatBytes32String(''),
    totalAttestedStake,
    totalRefutedStake
  } = report

  const isDiversified = isValidProduct(productKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      resolvedOn,
      text: projectOrProductName
    })
  }, [id, isDiversified, projectOrProductName, resolvedOn, setStatsByKey])

  return (
    <>
      {
        columns.map((col, i) => {
          return (
            <Fragment key={i}>
              {
                col.renderData({
                  projectOrProductName,
                  isDiversified,
                  imgSrc,
                  locale: router.locale,
                  status,
                  resolvedOn,
                  totalAttestedStake,
                  totalRefutedStake,
                  NPMTokenSymbol
                })
              }
            </Fragment>
          )
        })
      }
    </>
  )
}
