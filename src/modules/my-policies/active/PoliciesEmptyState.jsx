import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { CoverDropdown } from '@/common/CoverDropdown'
import { Routes } from '@/src/config/routes'
import { isValidProduct } from '@/src/helpers/cover'
import { useCoverDropdown } from '@/src/hooks/useCoverDropdown'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useNetwork } from '@/src/context/Network'

export const PoliciesEmptyState = () => {
  const router = useRouter()
  const { networkId } = useNetwork()

  const {
    loading,
    covers,
    selected,
    setSelected
  } = useCoverDropdown()

  const handleClick = () => {
    if (!selected) { return }

    router.push(
      Routes.PurchasePolicy(
        selected?.coverKey,
        isValidProduct(selected?.productKey) ? selected?.productKey : '',
        networkId
      )
    )
  }

  const { i18n } = useLingui()

  return (
    <div>
      <div
        className='flex flex-col items-center w-full pt-20'
        data-testid='empty-text'
      >
        <img
          src='/images/covers/empty-list-illustration.svg'
          alt={t(i18n)`No data found`}
          className='w-48 h-48'
        />
        <p className='max-w-full mt-8 text-center text-md text-404040 w-96'>
          <Trans>
            A cover policy enables you to claim and receive payout when an
            incident occurs. To purchase a policy, select a cover from the home
            screen.
          </Trans>
        </p>
      </div>

      <div className='w-full mx-auto mt-16 md:w-524px'>
        <CoverDropdown
          loading={loading}
          coversOrProducts={covers}
          selected={selected}
          setSelected={setSelected}
        />

        <RegularButton
          className='mt-8 py-2.5 px-4 font-medium rounded-lg uppercase w-full bg-primary'
          onClick={handleClick}
        >
          <Trans>Purchase Policy</Trans>
        </RegularButton>
      </div>
    </div>
  )
}
