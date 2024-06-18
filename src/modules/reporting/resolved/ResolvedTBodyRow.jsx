import {
  Fragment,
  useEffect
} from 'react'

import { useAppConstants } from '@/src/context/AppConstants'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useLanguageContext } from '@/src/i18n/i18n'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

export const ResolvedTBodyRow = ({
  columns = [],
  status,
  resolvedOn,
  report,
  coverOrProductData
}) => {
  const { locale } = useLanguageContext()
  const { setStatsByKey } = useSortableStats()
  const { NPMTokenSymbol } = useAppConstants()

  const {
    id,
    coverKey,
    productKey = safeFormatBytes32String(''),
    totalAttestationStake,
    totalRefutationStake
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
                  locale: locale,
                  status,
                  resolvedOn,
                  totalAttestationStake,
                  totalRefutationStake,
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
