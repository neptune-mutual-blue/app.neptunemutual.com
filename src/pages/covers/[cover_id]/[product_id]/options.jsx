import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/basket/CoverOptionsPage";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function Options({ disabled }) {
  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <CoverOptionsPage />
    </main>
  );
}
