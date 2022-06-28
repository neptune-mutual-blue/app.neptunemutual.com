import Head from "next/head";
import { PurchasePolicyReceipt } from "@/modules/my-policies/PurchasePolicyReceipt";

export default function PurchasePolicyReceiptPage() {
  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>

      <PurchasePolicyReceipt />
    </main>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      noHeader: true,
    },
  };
};
