import { NextResponse } from "next/server";

const unavailableTo = ["US"];
const redirectTo = "https://docs.neptunemutual.com/usage/unsupported-region";

export default function geoBlocking(req) {
  const country = req.geo?.country;
  const unavailable = unavailableTo.indexOf(country) > -1;

  if (unavailable) {
    return NextResponse.redirect(redirectTo);
  }

  return NextResponse.next();
}
