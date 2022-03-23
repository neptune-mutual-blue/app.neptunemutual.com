import { Container } from "@/components/UI/atoms/container";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import Head from "next/head";
import { TotalLiquidityChart } from "@/components/UI/molecules/TotalLiquidityChart";
import { useCountdown } from "@/lib/countdown/useCountdown";
import DateLib from "@/lib/date/DateLib";

const getTime = () => {
  return DateLib.unix().toString();
};
const target = DateLib.unix() + 60 * 60 * 44;
const formatCount = (n) => String(n).padStart(2, "0");

export function getStaticProps() {
  return {
    // returns the default 404 page with a status code of 404 in production
    notFound: process.env.NODE_ENV === "production",
  };
}

export default function Components() {
  const { hours, minutes, seconds } = useCountdown({
    target,
    getTime,
  });

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
