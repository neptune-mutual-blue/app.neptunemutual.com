import { ConnectorNames } from "../config/connectors";
import { chains } from "../config/chains";

/**
 *
 * @param {number} networkId
 * @returns
 */
const getNetworkParams = (networkId) => {
  const { id, ...params } = chains.find((x) => x.id === networkId);

  return params;
};

/**
 *
 * @param {string} connectorName
 * @param {number} selectedChainId
 * @returns {boolean} Success or failure
 */
export const setupNetwork = async (connectorName, selectedChainId) => {
  if (!selectedChainId) {
    return false;
  }

  switch (connectorName) {
    case ConnectorNames.BSC:
      try {
        const binanceProvider = window.BinanceChain;
        // bbc-mainnet, bbc-testnet, bsc-mainnet, bsc-testnet, eth-mainnet

        if (selectedChainId === 97) {
          await binanceProvider.switchNetwork("bsc-testnet");
          return true;
        } else if (selectedChainId === 56) {
          await binanceProvider.switchNetwork("bsc-mainnet");
          return true;
        } else if (selectedChainId === 1) {
          await binanceProvider.switchNetwork("eth-mainnet");
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }

    case ConnectorNames.Injected: {
      const provider = window.ethereum;

      if (!provider) {
        console.error("Can't setup network - window.ethereum is undefined");
        return false;
      }

      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [getNetworkParams(selectedChainId)],
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    default:
      return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  if (!window.ethereum) {
    return false;
  }

  const tokenAdded = await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};
