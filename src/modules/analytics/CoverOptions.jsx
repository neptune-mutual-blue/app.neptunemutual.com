import {useState, useEffect} from 'react'
import { Select } from '@/common/Select'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { utils } from '@neptunemutual/sdk'
import { ReportingDropdown } from '@/src/modules/reporting/reporting-dropdown'
import { getCoverImgSrc } from '@/src/helpers/cover'

export const CoverOptions = ({ defaultOptions, setSortType}) =>{

  const { data: covers, loading } = useFlattenedCoverProducts()

  const [selected, setSelected] = useState({})

  useEffect(() => {
    let ignore = false

    if (!ignore && covers && covers.length > 0) {
      setSelected(covers[0])
    }

    return () => {
      ignore = true
    }
  }, [covers])
  
  const { coverInfo: selectedCover } = useCoverOrProductData({
    coverKey: selected?.coverKey,
    productKey: selected?.productKey || utils.keyUtil.toBytes32('')
  })

  return (
    <div>
      <ReportingDropdown
        options={covers}
        selected={selected}
        setSelected={setSelected}
        selectedName={
          selectedCover?.infoObj?.coverName ||
          selectedCover?.infoObj?.projectName ||
          selectedCover?.infoObj?.productName
        }
        prefix={
          <div className='w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6'>
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