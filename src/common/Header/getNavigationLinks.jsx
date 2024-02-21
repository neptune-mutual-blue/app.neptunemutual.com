import { getActions } from '@/src/config/cover/actions'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'

/**
 *
 * @param {string} pathname
 * @returns
 */
const getNavigationLinks = (pathname) => {
  const policyEnabled = isFeatureEnabled('policy')
  const liquidityEnabled = isFeatureEnabled('liquidity')
  const reportingEnabled = isFeatureEnabled('reporting')
  const voteEscrowEnabled = isFeatureEnabled('vote-escrow')
  const governanceEnabled = isFeatureEnabled('governance')

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled

  const poolLink = Routes.Pools()

  const actions = getActions()

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
      name: 'Pool',
      href: poolLink,
      activeWhenStartsWith: '/pools'
    },
    reportingEnabled && {
      name: 'Reporting',
      href: Routes.ActiveReports,
      activeWhenStartsWith: '/reports'
    },
    governanceEnabled && {
      name: 'Governance',
      href: Routes.Governance,
      activeWhenStartsWith: Routes.Governance
    },
    voteEscrowEnabled && {
      name: 'Vote Escrow',
      href: Routes.VoteEscrow,
      activeWhenStartsWith: Routes.VoteEscrow
    },
    bridgeEnabled && {
      name: 'Bridge',
      href: Routes.Bridge,
      activeWhenStartsWith: '/bridge'
    },
    (policyEnabled || liquidityEnabled) && {
      name: 'My Account',
      items: [
        policyEnabled && {
          name: 'Policies',
          mobileName: 'My Policies',
          href: Routes.MyActivePolicies,
          activeWhenStartsWith: '/my-policies',
          imgSrc: actions.purchase.imgSrc
        },
        liquidityEnabled && {
          name: 'Liquidity',
          mobileName: 'My Liquidity',
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
        ? Boolean(link.items.find(l => { return pathname.startsWith(l.activeWhenStartsWith) }))
        : pathname.startsWith(link.activeWhenStartsWith)
    }

    if (link.items) {
      const updatedItems = link.items.map(l => { return { ...l, active: pathname.startsWith(l.activeWhenStartsWith) } })
      updated.items = updatedItems
    }

    return updated
  })

  return links
}

const getFlattenedNavLinks = () => {
  const _links = []
  const links = getNavigationLinks('')
  links.map((link) => {
    if (link.href) { _links.push(link) }
    if (link.items) { link.items.map(item => { return _links.push(item) }) }

    return null
  })

  return _links
}

export { getFlattenedNavLinks, getNavigationLinks }
