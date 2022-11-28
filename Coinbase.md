# Coinbase Connector Support

The following are the changes required for allowing the app to connect with
Coinbase Wallet App/extension

- Adding appropriate RPC url to CSP environment variable: 
  - if Fuji testnet: `https://api.avax-test.network/ext/bc/C/rpc`
  - if Ethereum mainnet: `https://mainnet.infura.io/v3/04f673a8619b4e3f89a49232d453f6f2`
