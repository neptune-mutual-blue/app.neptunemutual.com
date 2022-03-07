import Head from "next/head";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";
import { Container } from "@/components/UI/atoms/container";
import { Hero } from "@/components/UI/molecules/Hero";
import { HeroTitle } from "@/components/UI/molecules/HeroTitle";
import { MyPoliciesTxsTable } from "@/components/UI/organisms/my-policies/MyPoliciesTxsTable";

// This gets called on every request
export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      disabled: !!process.env.DISABLE_PURCHASE,
    },
  };
}

export default function MyPoliciesTxs({ disabled }) {
  if (disabled) {
    console.log(disabled);
    return <>This feature is not available yet</>;
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

      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              {
                name: "My Policies",
                href: "/my-policies/active",
                current: false,
              },
              { name: "Transaction List", href: "#", current: true },
            ]}
          />

          <HeroTitle>Transaction List</HeroTitle>
        </Container>

        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="pt-14 pb-28">
        <MyPoliciesTxsTable />
      </Container>
    </main>
  );
}
