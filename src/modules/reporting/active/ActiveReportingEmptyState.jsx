import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { CoverDropdown } from '@/common/CoverDropdown'
import { Label } from '@/common/Label/Label'
import { Loading } from '@/common/Loading'
import { getActions } from '@/src/config/cover/actions'
import { isValidProduct } from '@/src/helpers/cover'
import { useCoverDropdown } from '@/src/hooks/useCoverDropdown'

export const ActiveReportingEmptyState = () => {
  const router = useRouter()

  const {
    loading,
    covers,
    selected,
    setSelected
  } = useCoverDropdown()

  const actions = getActions()

  const handleAddReport = () => {
    if (!selected) { return }

    const coverKey = selected.coverKey
    const productKey = isValidProduct(selected.productKey) ? selected.productKey : ''
    router.push(actions.report.getHref(coverKey, productKey))
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div
      className='flex flex-col items-center w-full pt-20 pb-20'
      data-testid='active-reporting-empty'
    >
      <img
        src='/images/covers/empty-list-illustration.svg'
        alt='No data found'
        className='w-48 h-48'
      />
      <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>

        No known incident found for any cover product. If you believe a cover
        incident has occurred, earn rewards by reporting the incident.

      </p>
      <div className='flex flex-col w-full max-w-lg mt-16 mb-4'>
        <Label htmlFor='reporting-dropdown' className='sr-only'>
          select a cover
        </Label>
        <CoverDropdown
          loading={loading}
          coversOrProducts={covers}
          selected={selected}
          setSelected={setSelected}
        />
        <RegularButton
          className='w-full py-4 mt-6 font-medium uppercase'
          onClick={handleAddReport}
          data-testid='report-button'
        >
          Report an incident
        </RegularButton>
      </div>
    </div>
  )
}
