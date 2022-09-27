
import { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useSortableStats } from '@/src/context/SortableStatsContext'

export const ResolvedTBodyRow = ({
  columns = [],
  id,
  coverKey,
  productKey = safeFormatBytes32String(''),
  status,
  resolvedOn,
  totalAttestedStake,
  totalRefutedStake
}) => {
  const { setStatsByKey } = useSortableStats()
  const coverInfo = useCoverOrProductData({ coverKey, productKey })
  const isDiversified = isValidProduct(productKey)
  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })
  const router = useRouter()

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      resolvedOn,
      infoObj: coverInfo?.infoObj,
      isDiversified
    })
  }, [coverInfo?.infoObj, id, isDiversified, resolvedOn, setStatsByKey])

  return (
    <>
      {
        columns.map((col, i) => {
          return (
            <Fragment key={i}>
              {
                col.renderData({
                  coverInfo,
                  isDiversified,
                  imgSrc,
                  locale: router.locale,
                  status,
                  resolvedOn,
                  totalAttestedStake,
                  totalRefutedStake
                })
              }
            </Fragment>
          )
        })
      }
    </>
  )
}
