import { Container } from "@/common/components/Container/Container";
import { InputWithTrailingButton } from "@/common/components/Input/InputWithTrailingButton";
import Head from "next/head";
import { TotalLiquidityChart } from "@/src/common/components/TotalLiquidityChart";
import { useCountdown } from "@/lib/countdown/useCountdown";
import DateLib from "@/lib/date/DateLib";
import { useEffect } from "react";
import { getInfo as getStakingPoolInfo } from "@/src/services/protocol/staking-pool/info";
import { PoolTypes } from "@/src/config/constants";
import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

const getTime = () => {
  return DateLib.unix().toString();
};
const target = DateLib.unix() + 60 * 60 * 44;
const formatCount = (n) => String(n).padStart(2, "0");

export function getStaticProps() {
  return {
    // returns the default 404 page with a status code of 404 in production
    notFound: process.env.NODE_ENV === "production",
    props: {},
  };
}

export default function Components() {
  const { hours, minutes, seconds } = useCountdown({
    target,
    getTime,
  });

  const { account, chainId, library } = useWeb3React();

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    getStakingPoolInfo(
      "80001",
      PoolTypes.POD,
      "0x6262382d65786368616e67650000000000000000000000000000000000000000",
      account,
      signerOrProvider.provider
    )
      .then(console.log)
      .catch(console.error);
  }, [account, chainId, library]);

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <Container className="px-8 py-6">
        <div className="max-w-md">
          <InputWithTrailingButton
            buttonProps={{
              children: "Max",
              onClick: () => console.log("@todo: implement this handler"),
            }}
            unit="NPM-USDC LP"
            inputProps={{
              id: "test-input-id",
              placeholder: "Enter Amount",
            }}
          />
        </div>

        <br />
        <br />

        <div className="flex justify-center text-h2">
          <div>{formatCount(hours)}:</div>
          <div>{formatCount(minutes)}:</div>
          <div>{formatCount(seconds)}</div>
        </div>

        <br />
        <br />

        <div className="h-500 w-800">
          <TotalLiquidityChart />
        </div>
      </Container>
    </main>
  );
}
