import { initializeProvider } from '@metamask/providers'
import { WindowPostMessageStream as LocalMessageDuplexStream } from '@metamask/post-message-stream'

function setupMetamaskForFirefox () {
  if (navigator.userAgent.includes('Firefox') && !window.ethereum) {
    // Create a stream to a remote provider:
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'metamask-inpage',
      target: 'metamask-contentscript'
    })

    // this will initialize the provider and set it as window.ethereum
    initializeProvider({
      connectionStream: metamaskStream,
      shouldShimWeb3: true
    })
  }
}

export { setupMetamaskForFirefox }
