import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/cover/CoverOptionsPage";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";
import { Container } from "@/common/Container/Container";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isV2BasketCoverEnabled(),
    },
  };
}

export default function Options({ disabled }) {
  const router = useRouter();
  const { cover_id, product_id } = router.query;

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

      <Container className="pt-9">
        <BreadCrumbs
          pages={[
            { name: t`Home`, href: "/", current: false },
            {
              name: cover_id,
              href: `/covers/${cover_id}/options`,
              current: true,
            },
            {
              name: product_id,
              href: `/covers/${cover_id}/${product_id}/options`,
              current: true,
            },
          ]}
        />
      </Container>
      <CoverOptionsPage />
    </main>
  );
}
