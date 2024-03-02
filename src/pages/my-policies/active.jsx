import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useAppConstants } from '@/src/context/AppConstants'
import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import {
  PoliciesActivePage
} from '@/src/modules/my-policies/active/PoliciesActivePage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { useNetwork } from '@/src/context/Network'
import { useLingui } from '@lingui/react'

export default function MyPoliciesActive () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('policy', networkId)
  const {
    data: { totalActiveProtection, activePolicies },
    loading
  } = useActivePolicies()
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  const { i18n } = useLingui()

  if (disabled) {
    return <ComingSoon />
  }

  const heroStatValue =
    formatCurrency(
      convertFromUnits(
        totalActiveProtection,
        liquidityTokenDecimals
      ),
      router.locale
    ).long

  return (
    <main>
      <Seo />
      <PoliciesTabs
        active='active'
        heroStatTitle={t(i18n)`Total Active Protection`}
        heroStatValue={heroStatValue}
      >

        <PoliciesActivePage data={activePolicies} loading={loading} />

      </PoliciesTabs>
    </main>
  )
}
