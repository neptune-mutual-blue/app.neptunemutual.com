import Link from "next/link";
import { useRouter } from "next/router";

import FacebookIcon from "@/icons/facebook";
import LinkedinIcon from "@/icons/linkedin";
import TwitterIcon from "@/icons/twitter";

import { Container } from "@/components/atoms/container";
import { Grid } from "@/components/atoms/grid";

import { CoverCard } from "@/components/organisms/cover/card";
import { CoverActionCard } from "@/components/organisms/cover/action-card";
import { actions as coverActions } from "@/src/config/cover/actions";
import { OutlinedCard } from "@/components/molecules/outlined-card";
import { classNames } from "@/utils/classnames";
import { Checkbox } from "@/components/atoms/checkbox";
import { useEffect, useState } from "react";
import { AcceptRulesForm } from "@/components/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { CoverHero } from "@/components/organisms/cover/hero";

export const CoverPage = () => {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleAcceptRules = () => {
    setAccepted(true);
  };

  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.coverName;

  return (
    <div>
      <main className="bg-gray-bg">
        {/* hero */}
        <CoverHero
          coverInfo={coverInfo}
          title={title}
          imgSrc={imgSrc}
        ></CoverHero>

        {/* Content */}
        <div className="pt-12 pb-24 border-t border-t-ash-border">
          <Container className="grid gap-32 grid-cols-3">
            <div className="col-span-2">
              {/* Description */}
              <p>{coverInfo.about}</p>

              {/* Read more */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-40 hover:underline mt-4"
              >
                See More
              </a>

              {/* Rules */}
              <h4 className="text-h4 font-sora font-semibold mt-10 mb-6">
                Cover Rules
              </h4>
              <p className="mb-4">
                Carefully read the following terms and conditions. For a
                successful claim payout, all of the following points must be
                true.
              </p>
              <ol className="list-decimal pl-5">
                {coverInfo.rules.split("\n").map((x, i) => (
                  <li key={i}>
                    {x
                      .trim()
                      .replace(/^\d+\./g, "")
                      .trim()}
                  </li>
                ))}
              </ol>

              <br className="mt-20" />
              {!accepted && (
                <AcceptRulesForm onAccept={handleAcceptRules}>
                  I have read, understood, and agree to the terms of cover rules
                </AcceptRulesForm>
              )}

              {accepted && <h2>Form to purchase</h2>}
            </div>
            <div className="">
              <OutlinedCard className="bg-ash-brand p-10">
                <h3 className="text-h4 font-sora font-semibold">
                  Resolution Sources
                </h3>
                <p className="text-sm mt-1 mb-6 opacity-50">
                  7 days reporting period
                </p>

                <Link href="#">
                  <a className="block text-primary hover:underline mt-3">
                    Uniswap Knowledgebase
                  </a>
                </Link>

                <Link href="#">
                  <a className="block text-primary hover:underline mt-3">
                    Uniswap Twitter
                  </a>
                </Link>

                <hr className="mt-4 mb-6 border-t border-ash-border/60" />

                <div className="flex justify-between">
                  <span className="">Available Liquidity:</span>
                  <strong className="text-right font-bold">$ 750k</strong>
                </div>
              </OutlinedCard>
            </div>
          </Container>
        </div>

        {/* Cover Actions */}
        <div className="pt-20 pb-36 bg-ash-bg border-t border-t-ash-border">
          <Container>
            <h1 className="text-h2 font-sora font-bold mb-12 text-center">
              Didn&#x2019;t Find What You Were Looking For?
            </h1>
            <Grid>
              {Object.keys(coverActions)
                // .filter((x) => x !== "purchase")
                .map((actionKey, i) => {
                  return (
                    <Link key={i} href={`/${actionKey}`}>
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
      </main>
    </div>
  );
};
