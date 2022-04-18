import Head from "next/head";
import { useRouter } from "next/router";
import { BreadCrumbs } from "@/common/components/BreadCrumbs/BreadCrumbs";
import { Container } from "@/common/components/Container/Container";
import { Hero } from "@/src/common/components/Hero";
import { HeroTitle } from "@/src/common/components/HeroTitle";
import { HeroStat } from "@/src/common/components/HeroStat";
import { ClaimCxTokensTable } from "@/src/modules/my-policies/ClaimCxTokensTable";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { convertFromUnits } from "@/utils/bn";
import { toBytes32 } from "@/src/helpers/cover";
import { useActivePoliciesByCover } from "@/src/hooks/useActivePoliciesByCover";
import { formatCurrency } from "@/utils/formatter/currency";
import { ComingSoon } from "@/src/common/components/ComingSoon";
import { useFetchReportsByKeyAndDate } from "@/src/hooks/useFetchReportsByKeyAndDate";
import { Alert } from "@/common/components/Alert/Alert";
import { isFeatureEnabled } from "@/src/config/environment";

export function getServerSideProps() {
  return {
    props: {
      disabled: !isFeatureEnabled("claim"),
    },
  };
}

export default function ClaimPolicy({ disabled }) {
  const router = useRouter();
  const { cover_id, timestamp } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);
  const { data } = useActivePoliciesByCover({ coverKey });
  const { data: reports, loading: loadingReports } =
    useFetchReportsByKeyAndDate({
      coverKey,
      incidentDate: timestamp,
    });

  const title = coverInfo?.projectName;

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

      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            pages={[
              {
                name: "My Policies",
                href: "/my-policies/active",
                current: false,
              },
              {
                name: title,
                href: `/cover/${cover_id}/options`,
                current: false,
              },
              { name: "Claim", href: "#", current: true },
            ]}
          />

          <div className="flex items-start">
            <HeroTitle>My Policies</HeroTitle>

            {/* My Active Protection */}
            <HeroStat title="My Active Protection">
              <>
                {
                  formatCurrency(
                    convertFromUnits(data.totalActiveProtection),
                    "USD"
                  ).long
                }
              </>
            </HeroStat>
          </div>
        </Container>

        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="px-2 pt-12 pb-36">
        <h2 className="font-bold text-h2 font-sora">
          Available cxTokens for {title} to Claim
        </h2>
        <p className="w-full max-w-xl pt-6 pb-16 ml-0 text-lg">
          Claim your {title} cover cxTokens from the following addresses before
          the given claim date. Also indicated is the amount of cxTokens you
          will receive per claim.
        </p>

        {!loadingReports && reports.length === 0 && (
          <Alert className="mb-8 -mt-8">
            No valid incidents are reported with the given timestamp
          </Alert>
        )}

        <ClaimCxTokensTable
          activePolicies={data.activePolicies}
          coverKey={coverKey}
          incidentDate={timestamp}
          report={reports[0]}
        />
      </Container>
    </main>
  );
}
