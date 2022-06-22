import Head from "next/head";
import { CoverOptionsPage } from "@/src/modules/cover/CoverOptionsPage";
import { useRouter } from "next/router";
import { Container } from "@/common/Container/Container";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { t } from "@lingui/macro";

export default function Options() {
  const router = useRouter();
  const { cover_id } = router.query;

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
          ]}
        />
      </Container>
      <CoverOptionsPage />
    </main>
  );
}
