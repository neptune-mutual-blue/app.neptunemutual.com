import { handleBuildManifest, handleGeoBlocking, fallback, handleSiteManifest } from '@/src/middleware/handlers'

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

  response = handleSiteManifest(req)

  if (response) {
    return response
  }

  response = handleGeoBlocking(req)

  if (response) {
    return response
  }

  response = fallback(req)

  return response
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/:path',
    '/(.*)'
  ]
}
