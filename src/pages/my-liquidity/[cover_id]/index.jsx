import Head from "next/head";
import { MyLiquidityCoverPage } from "@/components/pages/my-liquidity/details";
import PageNotFound from "@/src/pages/404";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.NEXT_PUBLIC_DISABLE_ADD_LIQUIDITY,
    },
  };
}

export default function MyLiquidityCover({ disabled }) {
  if (disabled) {
    return <PageNotFound />;
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

      <MyLiquidityCoverPage />
    </main>
  );
}
