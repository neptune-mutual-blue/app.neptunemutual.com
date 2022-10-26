import { NextResponse } from 'next/server'

/** @type string */
const regions = process.env.NEXT_PUBLIC_UNSUPPORTED_REGIONS || ''

const unavailableTo = regions.split(',').filter((x) => !!x)

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function middleware (req) {
  // if (req.url.includes('buildManifest')) {
  //   const response = NextResponse.rewrite(new URL('/buildManifest.js', req.url))
  //   response.headers.set('Access-Control-Allow-Origin', 'null')
  //   return response
  // }

  const isHTMLPage = typeof req.headers.get('accept') === 'string' && (req.headers.get('accept').includes('text/html') || req.headers.get('accept').includes('application/xhtml+xml'))

  const country = req.geo?.country || ''
  const isGeoBlocked = country && unavailableTo.indexOf(country) > -1

  if (!isGeoBlocked) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', 'null')
    return response
  }

  if (req.url.includes('buildManifest')) {
    const response = NextResponse.rewrite(new URL('/buildManifest.js', req.url))
    response.headers.set('Access-Control-Allow-Origin', 'null')
    return response
  }

  const landingPage = req.nextUrl.clone().pathName === '/unavailable'
  if (isHTMLPage && !landingPage) {
    const response = NextResponse.rewrite(new URL('/unavailable', req.url), { status: 451 })
    response.headers.set('Access-Control-Allow-Origin', 'null')
    return response
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', 'null')
  return response
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/:path',
    '/(.*)'
  ]
}
