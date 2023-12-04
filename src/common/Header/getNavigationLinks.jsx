import { getActions } from '@/src/config/cover/actions'
import { isFeatureEnabled } from '@/src/config/environment'
import { Routes } from '@/src/config/routes'
import { t } from '@lingui/macro'

/**
 *
 * @param {string} pathname
 * @param {import('@lingui/core').I18n} i18n
 * @returns
 */
const getNavigationLinks = (pathname, i18n) => {
  const policyEnabled = isFeatureEnabled('policy')
  const liquidityEnabled = isFeatureEnabled('liquidity')
  const reportingEnabled = isFeatureEnabled('reporting')
  const voteEscrowEnabled = isFeatureEnabled('vote-escrow')
  const governanceEnabled = isFeatureEnabled('governance')

  const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
  const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
  const bridgeEnabled = isCelerBridgeEnabled || isLayerZeroBridgeEnabled

  const poolLink = Routes.Pools()

  const actions = getActions(i18n)

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
      name: t(i18n)`Pool`,
      href: poolLink,
      activeWhenStartsWith: '/pools'
    },
    reportingEnabled && {
      name: t(i18n)`Reporting`,
      href: Routes.ActiveReports,
      activeWhenStartsWith: '/reports'
    },
    governanceEnabled && {
      name: t(i18n)`Governance`,
      href: Routes.Governance,
      activeWhenStartsWith: Routes.Governance
    },
    voteEscrowEnabled && {
      name: t(i18n)`Vote Escrow`,
      href: Routes.VoteEscrow,
      activeWhenStartsWith: Routes.VoteEscrow
    },
    bridgeEnabled && {
      name: t(i18n)`Bridge`,
      href: Routes.Bridge,
      activeWhenStartsWith: '/bridge'
    },
    (policyEnabled || liquidityEnabled) && {
      name: t(i18n)`My Account`,
      items: [
        policyEnabled && {
          name: t(i18n)`Policies`,
          mobileName: t(i18n)`My Policies`,
          href: Routes.MyActivePolicies,
          activeWhenStartsWith: '/my-policies',
          imgSrc: actions.purchase.imgSrc
        },
        liquidityEnabled && {
          name: t(i18n)`Liquidity`,
          mobileName: t(i18n)`My Liquidity`,
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

const getFlattenedNavLinks = (i18n) => {
  const _links = []
  const links = getNavigationLinks('', i18n)
  links.map((link) => {
    if (link.href) { _links.push(link) }
    if (link.items) { link.items.map(item => { return _links.push(item) }) }

    return null
  })

  return _links
}

export { getFlattenedNavLinks, getNavigationLinks }
