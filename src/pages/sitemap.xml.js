import { Routes } from '@/src/config/routes'
import { getCoversAndProductsNames } from '@/utils/fetch/covers'
import { getIncidentReports } from '@/utils/fetch/reports'

const BASE_URL = 'https://app.neptunemutual.com'

function generateSiteMap (covers, reports) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${BASE_URL}${Routes.Home}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.NotFound}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.TransactionHistory}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.BondTransactions}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.PolicyTransactions}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.LiquidityTransactions}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.MyActivePolicies}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.MyExpiredPolicies}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.MyLiquidity}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.ActiveReports}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.ResolvedReports}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.BondPool}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.StakingPools}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.StakingPoolsTransactions}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.PodStakingPools}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.PodStakingPoolsTransactions}</loc>
      </url>
      <url>
        <loc>${BASE_URL}${Routes.Pools()}</loc>
      </url>
      
      ${
        covers.map(cover => {
          const { coverKey, products } = cover

          let _xml = `
            <url>
              <loc>${BASE_URL}${Routes.ViewCover(coverKey)}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.ProvideLiquidity(coverKey)}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.ViewCoverProductTerms(coverKey, '')}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.ReportNewIncident(coverKey, '')}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.PurchasePolicy(coverKey, '')}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.ViewCoverReports(coverKey)}</loc>
            </url>
          `

          if (products?.length) {
            _xml += products.map(product => {
              const { productKey } = product

              return `
                <url>
                  <loc>${BASE_URL}${Routes.ViewProduct(coverKey, productKey)}</loc>
                </url>
                <url>
                  <loc>${BASE_URL}${Routes.ViewCoverProductTerms(coverKey, productKey)}</loc>
                </url>
                <url>
                  <loc>${BASE_URL}${Routes.ReportNewIncident(coverKey, productKey)}</loc>
                </url>
                <url>
                  <loc>${BASE_URL}${Routes.PurchasePolicy(coverKey, productKey)}</loc>
                </url>
                <url>
                  <loc>${BASE_URL}${Routes.ViewProductReports(coverKey, productKey)}</loc>
                </url>
            `
            }).join('')
          }

          return _xml
        }).join('')
      }

      ${
        reports.map(report => {
          const { coverKey, productKey, incidentDate } = report

          const _xml = `
            <url>
              <loc>${BASE_URL}${Routes.ViewReport(coverKey, productKey, incidentDate)}</loc>
            </url>
            <url>
              <loc>${BASE_URL}${Routes.DisputeReport(coverKey, productKey, incidentDate)}</loc>
            </url>
          `

          return _xml
        }).join('')
      }
    </urlset>
 `
}

function SiteMap () {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps ({ res }) {
  const networkId = process.env.NEXT_PUBLIC_FALLBACK_NETWORK

  const coverData = await getCoversAndProductsNames(networkId)
  const reports = await getIncidentReports(networkId)

  const sitemap = generateSiteMap(coverData, reports)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap
