import { NextResponse } from "next/server";

/**
 * Unavailable to:
 *
 * United States (US)
 * Guam (GU)
 * American Samoa (AS)
 * Northern Mariana Islands (MP)
 * Puerto Rico (PR)
 * U.S. Virgin Islands (VI)
 * @type Array<string>
 */
const unavailableTo = ["US", "GU", "AS", "MP", "PR", "VI"];

export default function geoBlocking(req) {
  const country = req.geo?.country;
  const unavailable = unavailableTo.indexOf(country) > -1;
  const landingPage = req.nextUrl.clone().pathName === "/unavailable";

  if (unavailable && !landingPage) {
    return new NextResponse("Region Not Supported Yet", { status: 451 });
  }

  return NextResponse.next();
}
