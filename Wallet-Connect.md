# Wallet Connector Support

The following are the changes required for allowing the app to connect with
WalletConnect

- Add WalletConnect Safe domains to `connect-src` directive. For example:
  `https://registry.walletconnect.com/api/v2/wallets` and
  `wss://*.bridge.walletconnect.org/`
- Add RPC sources as well to `connect-src` directive. For example:
  `https://mainnet.infura.io` and `https://api.avax-test.network/ext/bc/C/rpc`
