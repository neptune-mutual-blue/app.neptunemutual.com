import Link from "next/link";
import { useRouter } from "next/router";

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
import { SocialIconLinks } from "@/components/molecules/social-icon-links";
import { CoverHeroTotalLiquidity } from "@/components/molecules/cover/hero/total-liquidity";
import { CoverHeroImage } from "@/components/molecules/cover/hero/image";
import { CoverHeroTitleAndWebsite } from "@/components/molecules/cover/hero/title-and-website";
import { OutlinedButton } from "@/components/atoms/button/outlined";

export const CoverHero = ({ children, coverInfo, imgSrc, title }) => {
  const router = useRouter();

  return (
    <div
      className="px-8 py-6"
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      {/* Back button */}
      <OutlinedButton onClick={() => router.back()}>
        &#x27F5;&nbsp;Back
      </OutlinedButton>

      <div className="py-14">
        <Container>
          <div className="flex">
            <div>
              <CoverHeroImage imgSrc={imgSrc} title={title} />
            </div>
            <div>
              <CoverHeroTitleAndWebsite links={coverInfo.links} title={title} />
              <SocialIconLinks links={coverInfo.links} />
            </div>

            {/* Total Liquidity */}
            <CoverHeroTotalLiquidity />
          </div>
        </Container>
      </div>
    </div>
  );
};
