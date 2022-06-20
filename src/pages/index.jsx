import Head from "next/head";

import LandingPage from "@/modules/landing-page";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import HomePage from "@/modules/home";

export default function Home({ disabled }) {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      {disabled ? <HomePage /> : <LandingPage />}
    </main>
  );
}

export const getStaticProps = () => {
  const disabled = !isV2BasketCoverEnabled();

  if (disabled) {
    return {
      props: {
        disabled,
      },
    };
  }

  return {
    props: {
      noWrappers: true,
      disabled,
    },
  };
};
