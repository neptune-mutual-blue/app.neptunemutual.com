import { detectChainId } from '@/utils/dns'
import { getAllowed } from 'http/cors'
import { NextResponse } from 'next/server'

/** @type string */
const regions = process.env.NEXT_PUBLIC_UNSUPPORTED_REGIONS || ''
const disableBuildManifest = false
const unavailableTo = regions.split(',').filter((x) => !!x)

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function handleBuildManifest (req) {
  if (!disableBuildManifest || !req.url.includes('buildManifest')) {
    return
  }

  const response = NextResponse.rewrite(new URL('/buildManifest.js', req.url))
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Access-Control-Allow-Origin', getAllowed(req))
  return response
}

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function handleRobotsTxt (req) {
  if (!req.url.includes('robots.txt')) {
    return
  }

  const mainnetChainIds = [1, 10, 56, 137, 42161, 43114]
  const networkId = detectChainId(req.headers.get('Host'))

  const isMainnet = mainnetChainIds.includes(parseInt(networkId))
  if (isMainnet) {
    return
  }

  const response = NextResponse.rewrite(new URL('/testnet-robots.txt', req.url))
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Access-Control-Allow-Origin', getAllowed(req))
  return response
}

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function handleSiteManifest (req) {
  if (!req.url.includes('manifest.json')) {
    return
  }

  const response = NextResponse.next()
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function handleGeoBlocking (req) {
  const country = req.geo?.country || ''
  const isGeoBlocked = country && unavailableTo.indexOf(country) > -1

  if (!isGeoBlocked) {
    return
  }

  const isHTMLPage = typeof req.headers.get('accept') === 'string' && (req.headers.get('accept').includes('text/html') || req.headers.get('accept').includes('application/xhtml+xml'))
  const landingPage = req.nextUrl.pathname === '/unavailable'

  if (isHTMLPage && !landingPage) {
    const response = NextResponse.rewrite(new URL('/unavailable', req.url), { status: 451 })
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Access-Control-Allow-Origin', getAllowed(req))
    return response
  }

  // Need to avoid redirecting back to home page
  if (req.url.includes('buildManifest')) {
    const response = NextResponse.rewrite(new URL('/buildManifest.js', req.url))
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Access-Control-Allow-Origin', getAllowed(req))
    return response
  }
}

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function fallback (req) {
  const response = NextResponse.next()
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Access-Control-Allow-Origin', getAllowed(req))
  return response
}
