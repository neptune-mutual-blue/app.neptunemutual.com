import { actions } from '@/src/config/cover/actions'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { Trans } from '@lingui/macro'

const getNavigationLinks = (pathname = '') => {
  const policyEnabled = isFeatureEnabled('policy')
  const liquidityEnabled = isFeatureEnabled('liquidity')
  const reportingEnabled = isFeatureEnabled('reporting')
  const voteEscrowEnabled = isFeatureEnabled('vote-escrow')
  const governanceEnabled = isFeatureEnabled('governance')

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled

  const poolLink = Routes.Pools()

  /**
   *
   * @typedef Link
   * @prop {JSX.Element} name
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
      name: <Trans>Pool</Trans>,
      href: poolLink,
      activeWhenStartsWith: '/pools'
    },
    reportingEnabled && {
      name: <Trans>Reporting</Trans>,
      href: Routes.ActiveReports,
      activeWhenStartsWith: '/reports'
    },
    governanceEnabled && {
      name: <Trans>Governance</Trans>,
      href: Routes.Governance,
      activeWhenStartsWith: Routes.Governance
    },
    voteEscrowEnabled && {
      name: <Trans>Vote Escrow</Trans>,
      href: Routes.VoteEscrow,
      activeWhenStartsWith: Routes.VoteEscrow
    },
    bridgeEnabled && {
      name: <Trans>Bridge</Trans>,
      href: Routes.Bridge,
      activeWhenStartsWith: '/bridge'
    },
    {
      name: <Trans>My Account</Trans>,
      items: [
        policyEnabled && {
          name: <Trans>Policies</Trans>,
          mobileName: <Trans>My Policies</Trans>,
          href: Routes.MyActivePolicies,
          activeWhenStartsWith: '/my-policies',
          imgSrc: actions.purchase.imgSrc
        },
        liquidityEnabled && {
          name: <Trans>Liquidity</Trans>,
          mobileName: <Trans>My Liquidity</Trans>,
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
  const links = getNavigationLinks()
  links.map((link) => {
    if (link.href) { _links.push(link) }
    if (link.items) { link.items.map(item => { return _links.push(item) }) }

    return null
  })

  return _links
}

export { getFlattenedNavLinks, getNavigationLinks }
