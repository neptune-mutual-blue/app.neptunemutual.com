import { GTM_ID } from "@/src/config/constants";
import Document, { Html, Head, Main, NextScript } from "next/document";
import http from "http";

const connectSources = [
  process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "https://api.thegraph.com/ipfs/",
  "https://ipfs.infura.io:5001/",
]
  .map((x) => (x || "").trim())
  .filter((x) => !!x)
  .join(" ");

const csp = [
  `script-src 'self' https://tagmanager.google.com https://*.googletagmanager.com`,
  `connect-src 'self' https://*.neptunemutual.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${
    connectSources || ""
  }`,
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
  "upgrade-insecure-requests",
  "frame-ancestors 'none'",
  "default-src 'none'",
  "prefetch-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "img-src 'self' www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com data:",
  "font-src 'self' https://fonts.gstatic.com data:",
];

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    let pageProps = null;

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: (App) => (props) => {
          pageProps = props.pageProps;
          return <App {...props} />;
        },
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, pageProps };
  }

  render() {
    const { pageProps } = this.props;

    console.log({ pageProps, http });
    return (
      <Html>
        <Head nonce={pageProps?.nonce}>
          <meta
            httpEquiv="Content-Security-Policy"
            content={csp
              .join("; ")
              .replace(`script-src`, `script-src 'nonce-${pageProps?.nonce}'`)}
          />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#01052D" />
          <meta
            name="msapplication-TileImage"
            content="/icons/ms-icon-144x144.png"
          />
          <meta name="theme-color" content="#01052D" />
        </Head>
        <body
          translate="no"
          className="text-black font-poppins text-para bg-f1f3f6"
        >
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Main />
          <NextScript nonce={pageProps.nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
