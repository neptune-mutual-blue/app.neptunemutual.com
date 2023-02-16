import { useEffect } from 'react'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { utils } from '@neptunemutual/sdk'
import { CalculatorOptionDropDown } from '@/src/modules/analytics/CalculatorOptionDropDown'
import { getCoverImgSrc } from '@/src/helpers/cover'

export const CoverOptions = ({ selected, setSelected }) => {
  const { data: covers } = useFlattenedCoverProducts()

  useEffect(() => {
    let ignore = false

    if (!ignore && covers && covers.length > 0) {
      setSelected(covers[0])
    }

    return () => {
      ignore = true
    }
  }, [covers, setSelected])

  const { coverInfo: selectedCover } = useCoverOrProductData({
    coverKey: selected?.coverKey,
    productKey: selected?.productKey || utils.keyUtil.toBytes32('')
  })

  return (
    <div>
      <CalculatorOptionDropDown
        options={covers}
        selected={selected}
        setSelected={setSelected}
        selectedName={
          selectedCover?.infoObj?.coverName ||
          selectedCover?.infoObj?.projectName ||
          selectedCover?.infoObj?.productName
        }
        prefix={
          <div className='w-5 h-5 rounded-full'>
            <img
              src={getCoverImgSrc({
                key: selectedCover?.productKey || selectedCover?.coverKey
              })}
              alt={
                selectedCover?.infoObj.coverName ||
                selectedCover?.infoObj.productName
              }
            />
          </div>
        }
      />
    </div>
  )
}
