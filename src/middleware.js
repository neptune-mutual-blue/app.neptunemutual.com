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
  console.log('middleware', req.url)
  // console.log('middleware', req.method)
  // console.log('middleware', req.geo)

  if (req.url.includes('buildManifest')) {
    // return NextResponse.next()
    // return NextResponse.json({ message: 'Auth required' }, { status: 401 })
    return NextResponse.rewrite(new URL('/buildManifest.js', req.url))
  }

  const country = req.geo?.country || ''

  if (!country || unavailableTo.length === 0) {
    return NextResponse.next()
  }

  const unavailable = unavailableTo.indexOf(country) > -1
  const landingPage = req.nextUrl.clone().pathname === '/unavailable'

  if (unavailable && !landingPage) {
    return NextResponse.rewrite(new URL('/unavailable', req.url), { status: 451 })
    // return NextResponse.redirect(new URL('/unavailable', req.url))
  }

  return NextResponse.next()
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|static|_next|assets|favicon.ico).*)',
    '/(.*buildManifest.js*)',
    '/'
  ]
}
