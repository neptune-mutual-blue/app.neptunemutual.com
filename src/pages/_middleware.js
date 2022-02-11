import { NextResponse } from "next/server";

const unavailableTo = ["US"];

export default function geoBlocking(req) {
  const country = req.geo?.country;
  const unavailable = unavailableTo.indexOf(country) > -1;
  const landingPage = req.nextUrl.clone().pathName === "/unavailable";

  if (unavailable && !landingPage) {
    return new NextResponse("Region Not Supported Yet", { status: 451 });
  }

  return NextResponse.next();
}
