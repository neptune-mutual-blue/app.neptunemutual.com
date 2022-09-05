import { csp, generateGtmHash } from "@/utils/cspHeader";
import { NextResponse } from "next/server";
import { gtmScript } from "@/src/config/google";

/** @type string */
const regions = process.env.NEXT_PUBLIC_UNSUPPORTED_REGIONS || "";

const unavailableTo = regions.split(",").filter((x) => !!x);

/**
 *
 * @param {import("next/server").NextRequest} req
 * @returns {Promise<Response | undefined> | Response | undefined}
 */
export default function geoBlocking(req) {
  const country = req.geo?.country || "";

  if (!country || unavailableTo.length == 0) {
    return NextResponse.next();
  }

  const unavailable = unavailableTo.indexOf(country) > -1;
  const landingPage = req.nextUrl.clone().pathName === "/unavailable";

  if (unavailable && !landingPage) {
    return new NextResponse("Region Not Supported Yet", { status: 451 });
  }

  return NextResponse.next();
}

export function middleware() {
  const response = NextResponse.next();

  const headerKey = "Content-Security-Policy";
  const scriptHash = generateGtmHash();
  const cspString = csp
    .join("; ")
    .replace(`script-src 'self'`, `script-src 'self' 'sha256-${scriptHash}'`);

  console.log({ gtmScript });
  response.headers.append(headerKey, cspString);

  return response;
}
