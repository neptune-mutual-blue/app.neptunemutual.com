import { NetworkNames } from "@/lib/connect-wallet/config/chains";
import { testnetChainIds } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";

export const Banner = () => {
  const { networkId } = useAppContext();

  const isTestnet = testnetChainIds.indexOf(networkId) > -1;

  if (!networkId || !isTestnet) {
    return null;
  }

  return (
    <div className="bg-4e7dd9 text-white text-sm text-center">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <p className="ml-3">
          You are using {NetworkNames[networkId]}. Please{" "}
          <a
            className="underline"
            href="https://faucet.hicif.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>{" "}
          to get testnet tokens.
        </p>
      </div>
    </div>
  );
};
