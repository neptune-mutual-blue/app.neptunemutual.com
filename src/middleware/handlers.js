import { UAParser } from 'ua-parser-js'
import { getAllowed } from 'http/cors'
import { NextResponse } from 'next/server'

/** @type string */
const regions = process.env.NEXT_PUBLIC_UNSUPPORTED_REGIONS || ''
const disableBuildManifest = false
const unavailableTo = regions.split(',').filter((x) => { return !!x })

function getIosCsp () {
  const defaultValue = process.env.NEXT_PUBLIC_HEADERS_CONTENT_SECURITY_POLICY || ''

  const value = defaultValue.split(';').map(part => {
    if (part.startsWith('script-src ')) {
      return part + " 'unsafe-inline' 'unsafe-eval'"
    }

    return part
  }).join(';')

  return value
}

/**
 *
 * @param {import("next/server").NextResponse} res
 * @param {import("next/server").NextRequest} req
 */
function addCommonHeaders (res, req) {
  res.headers.set('Pragma', 'no-cache')

  const parser = new UAParser(req.headers.get('User-Agent'))
  if (parser.getOS().name === 'iOS') {
    res.headers.set('Content-Security-Policy', getIosCsp())
  }
}

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
  addCommonHeaders(response, req)
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
  addCommonHeaders(response, req)
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
    addCommonHeaders(response, req)
    response.headers.set('Access-Control-Allow-Origin', getAllowed(req))

    return response
  }

  // Need to avoid redirecting back to home page
  if (req.url.includes('buildManifest')) {
    const response = NextResponse.rewrite(new URL('/buildManifest.js', req.url))
    addCommonHeaders(response, req)
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
  addCommonHeaders(response, req)
  response.headers.set('Access-Control-Allow-Origin', getAllowed(req))

  return response
}
