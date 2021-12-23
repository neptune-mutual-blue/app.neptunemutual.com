import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";
import { CoverActionCard } from "@/components/UI/organisms/cover/action-card";
import { actions as coverActions } from "@/src/config/cover/actions";

export const CoverActionsFooter = ({ activeKey }) => {
  return (
    <>
      {/* Cover Actions */}
      <div className="pt-20 pb-36 bg-F1F3F6 border-t border-t-B0C4DB">
        <Container>
          <h1 className="text-h2 font-sora font-bold mb-12 text-center">
            Didn&#x2019;t Find What You Were Looking For?
          </h1>
          <Grid>
            {Object.keys(coverActions)
              .filter((x) => x !== activeKey)
              .map((actionKey, i) => {
                return (
                  <Link key={i} href={`/cover/cover_id/${actionKey}`}>
                    <a className="rounded-4xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none">
                      <CoverActionCard
                        title={coverActions[actionKey].title}
                        description={coverActions[actionKey].description}
                        imgSrc={`/cover-actions/${actionKey}.png`}
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
