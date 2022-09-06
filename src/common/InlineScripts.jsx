import Script from "next/script";
import { gtmScript } from "@/src/config/scripts/google";

export function InlineScripts() {
  return (
    <Script
      id="gtag-base"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{ __html: gtmScript }}
    />
  );
}
