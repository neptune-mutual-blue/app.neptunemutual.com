import { RegularButton } from '@/common/Button/RegularButton'
import { Label } from '@/common/Label/Label'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { actions } from '@/src/config/cover/actions'
import { t, Trans } from '@lingui/macro'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { CoverDropdown } from '@/common/CoverDropdown'
import { isValidProduct } from '@/src/helpers/cover'

export const ActiveReportingEmptyState = () => {
  const router = useRouter()

  const { data: covers, loading } = useFlattenedCoverProducts()

  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!ignore && covers && covers.length > 0) {
      setSelected(covers[0])
    }

    return () => {
      ignore = true
    }
  }, [covers])

  const handleAddReport = () => {
    if (!selected) return

    const coverKey = selected.coverKey
    const productKey = isValidProduct(selected.productKey) ? selected.productKey : ''
    router.push(actions.report.getHref(coverKey, productKey))
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
        alt={t`No data found`}
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
        <CoverDropdown
          onChange={setSelected}
        />
        <RegularButton
          className='w-full py-4 mt-6 text-sm font-medium uppercase'
          onClick={handleAddReport}
        >
          <Trans>Report an incident</Trans>
        </RegularButton>
      </div>
    </div>
  )
}
