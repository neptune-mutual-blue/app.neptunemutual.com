import Link from "next/link";
import { useRouter } from "next/router";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/card";
import { CoverActionCard } from "@/components/UI/organisms/cover/action-card";
import { actions as coverActions } from "@/src/config/cover/actions";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { classNames } from "@/utils/classnames";
import { Checkbox } from "@/components/UI/atoms/checkbox";
import { useEffect, useState } from "react";
import { AcceptRulesForm } from "@/components/UI/organisms/accept-rules-form";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";
import { SocialIconLinks } from "@/components/UI/molecules/social-icon-links";
import { CoverHeroTotalLiquidity } from "@/components/UI/molecules/cover/hero/total-liquidity";
import { CoverHeroImage } from "@/components/UI/molecules/cover/hero/image";
import { CoverHeroTitleAndWebsite } from "@/components/UI/molecules/cover/hero/title-and-website";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { BreadCrumbs } from "@/components/UI/atoms/breadcrumbs";

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
      <div className="py-14">
        <Container>
          <BreadCrumbs
            pages={[
              { name: "Clearpool", current: false },
              { name: "Purchase Policy", href: "#", current: true },
            ]}
          />
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
