import { handleBuildManifest, handleGeoBlocking } from '@/src/middleware/handlers'
import { NextResponse } from 'next/server'

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export function middleware (req) {
  let response = handleBuildManifest(req)

  if (response) {
    return response
  }

  response = handleGeoBlocking(req)

  if (response) {
    return response
  }

  response = NextResponse.next()
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
