import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { useAppConstants } from '@/src/context/AppConstants'
import { useActivePolicies } from '@/src/hooks/useActivePolicies'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  PoliciesActivePage
} from '@/src/modules/my-policies/active/PoliciesActivePage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'
import { getNetworks } from '@/src/ssg/static-paths'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function MyPoliciesActive ({ networkId }) {
  const disabled = !isFeatureEnabled('policy', networkId)
  const {
    data: { totalActiveProtection, activePolicies },
    loading
  } = useActivePolicies()
  const { locale } = useLanguageContext()
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
      locale
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
