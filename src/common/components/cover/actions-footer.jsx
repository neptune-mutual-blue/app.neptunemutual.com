import Link from "next/link";

import { Container } from "@/src/common/components/container";
import { Grid } from "@/src/common/components/grid";
import { CoverActionCard } from "@/src/common/components/cover/action-card";
import { actions as coverActions } from "@/src/config/cover/actions";
import { useRouter } from "next/router";

export const CoverActionsFooter = ({ activeKey }) => {
  const router = useRouter();
  const { cover_id } = router.query;

  return (
    <>
      {/* Cover Actions */}
      <div className="pt-12 border-t sm:pt-20 pb-36 bg-f1f3f6 border-t-B0C4DB">
        <Container>
          <h1 className="mb-10 font-bold text-center text-h4 md:text-h2 font-sora sm:mb-12">
            Didn&#x2019;t Find What You Were Looking For?
          </h1>
          <Grid>
            {Object.keys(coverActions)
              .filter((x) => x !== activeKey)
              .map((actionKey, i) => {
                return (
                  <Link
                    key={i}
                    href={coverActions[actionKey].getHref(cover_id)}
                  >
                    <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                      <CoverActionCard
                        title={coverActions[actionKey].title}
                        description={coverActions[actionKey].description}
                        imgSrc={coverActions[actionKey].footerImgSrc}
                      ></CoverActionCard>
                    </a>
                  </Link>
                );
              })}
          </Grid>
        </Container>
      </div>
    </>
  );
};
