import { NoScript } from '@/common/NoScript'
import Document, { Html, Head, Main, NextScript } from 'next/document'

const opImageUri = 'https://app.neptunemutual.net/images/og.png'
const title = 'Neptune Mutual Decentralized Insurance'
const description = 'Neptune Mutual protects the Ethereum community from hacks and exploits through its unique parametric DeFi insurance marketplace designed to cover, protect and secure onchain digital assets; power by Ethereum, driven by stablecoins.'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link
            rel='apple-touch-icon'
            sizes='57x57'
            href='/icons/apple-icon-57x57.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='60x60'
            href='/icons/apple-icon-60x60.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='72x72'
            href='/icons/apple-icon-72x72.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='76x76'
            href='/icons/apple-icon-76x76.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='114x114'
            href='/icons/apple-icon-114x114.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='120x120'
            href='/icons/apple-icon-120x120.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='144x144'
            href='/icons/apple-icon-144x144.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='152x152'
            href='/icons/apple-icon-152x152.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/icons/apple-icon-180x180.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='192x192'
            href='/icons/android-icon-192x192.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='96x96'
            href='/favicon-96x96.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/manifest.json' />
          <meta name='msapplication-TileColor' content='#01052D' />
          <meta
            name='msapplication-TileImage'
            content='/icons/ms-icon-144x144.png'
          />
          <meta name='theme-color' content='#01052D' />

          <meta property='og:type' content='website' />
          <meta property='og:image' content={opImageUri} />
          <meta property='og:title' content={title} />
          <meta property='og:description' content={description} />

          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content={title} />
          <meta name='twitter:description' content={description} />
          <meta name='twitter:image' content={opImageUri} />
        </Head>
        <body
          translate='no'
          className='text-black font-poppins text-para bg-f6f7f9'
        >
          <NoScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
