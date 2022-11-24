# Neptune Mutual App

An open source interface for Neptune Mutual &mdash; a protocol that provides you with guaranteed stablecoin liquidity to reduce your risk exposure by hedging against possible capital risks and smart contract vulnerabilities.

- Website: [neptunemutual.com](https://neptunemutual.com)
- Docs: [docs.neptunemutual.com](https://docs.neptunemutual.com)
- Twitter: [@neptunemutual](https://twitter.com/neptunemutual)
- Reddit: [/r/NeptuneMutual](https://www.reddit.com/r/NeptuneMutual)
- Discord: [NeptuneMutual](https://discord.gg/2qMGTtJtnW)

## Contributions

For steps on local deployment, development, and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).

## Gnosis Connector

The following are the changes required for allowing the app for connecting with Gnosis wallet

- Add Gnosis Safe domains to `frame-ancestors` directive. For example: `https://gnosis-safe.io` or `https://app.safe.global`
- Add Gnosis Safe RPC to `connect-src` directive. For example: `https://mainnet.infura.io`
- Allow `manifest.json` file to be accessed from Gnosis Safe domains
