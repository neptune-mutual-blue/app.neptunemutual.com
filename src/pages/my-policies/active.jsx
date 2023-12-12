import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabledServer } from '@/src/config/environment'
import { useAppConstants } from '@/src/context/AppConstants'
import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import {
  PoliciesActivePage
} from '@/src/modules/my-policies/active/PoliciesActivePage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabledServer('policy')
    }
  }
}

export default function MyPoliciesActive ({ disabled }) {
  const {
    data: { totalActiveProtection, activePolicies },
    loading
  } = useActivePolicies()
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

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
        heroStatTitle={<Trans>Total Active Protection</Trans>}
        heroStatValue={heroStatValue}
      >

        <PoliciesActivePage data={activePolicies} loading={loading} />

      </PoliciesTabs>
    </main>
  )
}
