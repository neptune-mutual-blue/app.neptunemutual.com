import { gtmScript } from "@/src/config/google";
import Script from "next/script";

function GoogleTagManager() {
  return (
    <Script
      id="gtag-base"
      dangerouslySetInnerHTML={{
        __html: gtmScript,
      }}
    />
  );
}

export default GoogleTagManager;
