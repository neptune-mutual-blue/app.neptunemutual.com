import { actions } from '@/src/config/cover/actions'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { t } from '@lingui/macro'

const getNavigationLinks = (pathname = '') => {
  const policyEnabled = isFeatureEnabled('policy')
  const liquidityEnabled = isFeatureEnabled('liquidity')
  const reportingEnabled = isFeatureEnabled('reporting')
  const voteEscrowEnabled = isFeatureEnabled('vote-escrow')

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled
  const bridgeUrl = isCelerBridgeEnabled ? Routes.BridgeCeler : Routes.BridgeLayerZero

  const poolLink = Routes.Pools()

  /**
   *
   * @typedef Link
   * @prop {string} name
   * @prop {string} [mobileName]
   * @prop {string} [href]
   * @prop {string} [activeWhenStartsWith]
   * @prop {boolean} [active]
   * @prop {string} [imgSrc]
   * @prop {Link[]} [items]
   */

  /** @type {Link[]} */
  let links = [
    poolLink && {
      name: t`Pool`,
      href: poolLink,
      activeWhenStartsWith: '/pools'
    },
    reportingEnabled && {
      name: t`Reporting`,
      href: Routes.ActiveReports,
      activeWhenStartsWith: '/reports'
    },
    voteEscrowEnabled && {
      name: t`Vote Escrow`,
      href: Routes.VoteEscrow,
      activeWhenStartsWith: Routes.VoteEscrow
    },
    bridgeEnabled && {
      name: t`Bridge`,
      href: bridgeUrl,
      activeWhenStartsWith: bridgeUrl
    },
    {
      name: t`My Account`,
      items: [
        policyEnabled && {
          name: t`Policies`,
          mobileName: t`My Policies`,
          href: Routes.MyActivePolicies,
          activeWhenStartsWith: '/my-policies',
          imgSrc: actions.purchase.imgSrc
        },
        liquidityEnabled && {
          name: t`Liquidity`,
          mobileName: t`My Liquidity`,
          href: Routes.MyLiquidity,
          activeWhenStartsWith: '/my-liquidity',
          imgSrc: actions['add-liquidity'].imgSrc
        }
      ]
    }
  ]

  links = links.filter(Boolean)

  links = links.map((link) => {
    const updated = {
      ...link,
      active: link.items
        ? Boolean(link.items.find(l => pathname.startsWith(l.activeWhenStartsWith)))
        : pathname.startsWith(link.activeWhenStartsWith)
    }

    if (link.items) {
      const updatedItems = link.items.map(l => ({ ...l, active: pathname.startsWith(l.activeWhenStartsWith) }))
      updated.items = updatedItems
    }

    return updated
  })

  // links.unshift({ name: t`Home`, href: '/', active: pathname === '/' })

  return links
}

const getFlattenedNavLinks = () => {
  const _links = []
  const links = getNavigationLinks()
  links.map((link) => {
    if (link.href) _links.push(link)
    if (link.items) link.items.map(item => _links.push(item))
    return null
  })

  return _links
}

export { getNavigationLinks, getFlattenedNavLinks }
