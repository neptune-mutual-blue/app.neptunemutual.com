# Gnosis Connector Support

The following are the changes required for allowing the app to connect with
Gnosis Safe Multisig Wallet

- Add Gnosis Safe domains to `frame-ancestors` directive. For example:
  `https://gnosis-safe.io` or `https://app.safe.global`
- Add Gnosis Safe RPC to `connect-src` directive. For example:
  `https://mainnet.infura.io`
- Allow `manifest.json` file to be accessed from Gnosis Safe domains
  - Set `Access-Control-Allow-Origin` header for `manifest.json` to `*`
  - Info: Gnosis will use the name and logo from `manifest.json`
