import { RegularButton } from '@/common/Button/RegularButton'
import { Label } from '@/common/Label/Label'
import { useEffect, useState } from 'react'
import { ReportingDropdown } from '@/src/modules/reporting/reporting-dropdown'
import { useRouter } from 'next/router'
import { actions } from '@/src/config/cover/actions'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { t, Trans } from '@lingui/macro'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { utils } from '@neptunemutual/sdk'

export const ActiveReportingEmptyState = () => {
  const router = useRouter()

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

  const selectedCover = useCoverOrProductData({
    coverKey: selected?.coverKey,
    productKey: selected?.productKey || utils.keyUtil.toBytes32('')
  })

  const handleAddReport = () => {
    router.push(
      actions.report.getHref(selected?.coverKey, selected?.productKey)
    )
  }

  if (loading) {
    return (
      <>
        <Trans>loading...</Trans>
      </>
    )
  }

  return (
    <div
      className='flex flex-col items-center w-full pt-20 pb-20'
      data-testid='active-reporting-empty'
    >
      <img
        src='/images/covers/empty-list-illustration.svg'
        alt={t`no data found`}
        className='w-48 h-48'
      />
      <p className='max-w-full mt-8 text-center text-h5 text-404040 w-96'>
        <Trans>
          No known incident found for any cover product. If you believe a cover
          incident has occurred, earn rewards by reporting the incident.
        </Trans>
      </p>
      <div className='flex flex-col w-full max-w-lg mt-16 mb-4'>
        <Label htmlFor='reporting-dropdown' className='sr-only'>
          <Trans>select a cover</Trans>
        </Label>
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
        <RegularButton
          className='w-full py-4 mt-6 text-sm font-medium uppercase'
          onClick={handleAddReport}
        >
          <Trans>REPORT AN INCIDENT</Trans>
        </RegularButton>
      </div>
    </div>
  )
}
