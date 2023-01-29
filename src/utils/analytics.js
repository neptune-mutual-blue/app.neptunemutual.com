export function addClarityAnalytics (clarityTrackingCode) {
  if (!clarityTrackingCode) {
    return
  }

  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments)
    }

  const element = document.createElement('script')
  element.async = true
  element.src = 'https://www.clarity.ms/tag/' + clarityTrackingCode

  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(element, firstScript)
}

export function addGoogleAnalytics (googleAnalyticsId) {
  if (!googleAnalyticsId) {
    return
  }

  // Global site tag (gtag.js) - Google Analytics
  const gtagSource = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
  const globalScript = document.createElement('script')
  globalScript.async = true
  globalScript.setAttribute('src', gtagSource)
  document.head.appendChild(globalScript)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', googleAnalyticsId)
}
