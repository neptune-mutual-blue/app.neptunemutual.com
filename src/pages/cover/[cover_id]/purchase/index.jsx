import Head from "next/head";
import { toBytes32 } from "@/src/helpers/cover";
import { useRouter } from "next/router";
import { CoverInfoProvider } from "@/common/Cover/CoverInfoContext";

import { CoverPurchaseDetailsPage } from "@/src/modules/cover/purchase";
import { ComingSoon } from "@/common/ComingSoon";
import { isFeatureEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("policy"),
    },
  };
}

export default function CoverPurchaseDetails({ disabled }) {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);

  if (disabled) {
    return <ComingSoon />;
  }

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <CoverInfoProvider coverKey={coverKey}>
        <CoverPurchaseDetailsPage />
      </CoverInfoProvider>
    </>
  );
}
