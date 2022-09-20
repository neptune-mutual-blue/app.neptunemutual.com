import ReportListing from "@/src/modules/reporting/ReportListing";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Index() {
  const { query, locale } = useRouter();

  const { product_id = "", cover_id = "" } = query || {};

  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <ReportListing
        locale={locale}
        cover_id={cover_id}
        product_id={product_id}
      />
    </>
  );
}
