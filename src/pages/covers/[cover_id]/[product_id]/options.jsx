import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/basket/CoverOptionsPage";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { ComingSoon } from "@/common/ComingSoon";
import Router from "next/router";
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
            { name: t`Home`, href: "/basket", current: false },
            {
              name: Router.query.cover_id,
              href: `/basket/${Router.query.cover_id}/${Router.query.product_id}`,
              current: true,
            },
          ]}
        />
      </Container>
      <CoverOptionsPage />
    </main>
  );
}
