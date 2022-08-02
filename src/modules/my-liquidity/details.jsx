import { useRouter } from "next/router";
import { Container } from "@/common/Container/Container";
import { BreadCrumbs } from "@/common/BreadCrumbs/BreadCrumbs";
import { Hero } from "@/common/Hero";
import { HeroStat } from "@/common/HeroStat";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { CoverProfileInfo } from "@/common/CoverProfileInfo/CoverProfileInfo";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { ProvideLiquidityForm } from "@/common/LiquidityForms/ProvideLiquidityForm";
import { t, Trans } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { LiquidityResolutionSources } from "@/common/LiquidityResolutionSources/LiquidityResolutionSources";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { CoveredProducts } from "@/modules/my-liquidity/content/CoveredProducts";
import { DiversifiedCoverProfileInfo } from "@/common/CoverProfileInfo/DiversifiedCoverProfileInfo";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";

export const MyLiquidityCoverPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String("");

  const { liquidityTokenDecimals } = useAppConstants();

  const coverInfo = useCoverOrProductData({ coverKey, productKey });
  const isDiversified = coverInfo?.supportsProducts;

  const { accrueInterest, isWithdrawalWindowOpen, info } =
    useLiquidityFormsContext();

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const projectName = !isDiversified
    ? coverInfo?.infoObj.projectName
    : coverInfo?.infoObj.coverName;

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const myLiquidity = info.myUnrealizedShare;

  return (
    <div className="bg-f1f3f6" data-testid="main-container">
      {/* hero */}
      <Hero>
        <Container className="px-2 py-20">
          <BreadCrumbs
            data-testid="breadcrumbs"
            pages={[
              {
                name: t`My Liquidity`,
                href: "/my-liquidity",
                current: false,
              },
              {
                name: projectName,
                href: "#",
                current: true,
              },
            ]}
          />
          <div className="flex flex-wrap md:flex-nowrap">
            {isDiversified ? (
              <DiversifiedCoverProfileInfo projectName={projectName} />
            ) : (
              <CoverProfileInfo
                productKey={productKey}
                coverKey={coverKey}
                projectName={projectName}
                links={coverInfo?.infoObj.links}
                imgSrc={imgSrc}
              />
            )}

            {/* My Liquidity */}
            <HeroStat title={t`My Liquidity`} data-testid="herostat">
              {
                formatCurrency(
                  convertFromUnits(myLiquidity, liquidityTokenDecimals),
                  router.locale
                ).long
              }
            </HeroStat>
          </div>
        </Container>
      </Hero>

      {/* Content */}
      <div className="pt-12 pb-24 border-t border-t-B0C4DB">
        {isDiversified ? <CoveredProducts coverInfo={coverInfo} /> : null}

        <Container className="grid grid-cols-3 lg:gap-32">
          <div className="col-span-3 md:col-span-2">
            {/* Description */}
            <span className="hidden lg:block" data-testid="see-more-container">
              <SeeMoreParagraph text={coverInfo?.infoObj?.about} />
            </span>

            <div className="mt-12" data-testid="provide-liquidity-container">
              <ProvideLiquidityForm
                coverKey={coverKey}
                info={info}
                isDiversified={isDiversified}
              />
            </div>
          </div>

          <span className="block col-span-3 row-start-1 lg:hidden mb-11">
            <SeeMoreParagraph text={coverInfo?.infoObj?.about} />
          </span>

          <LiquidityResolutionSources
            isDiversified={isDiversified}
            coverInfo={coverInfo}
            info={info}
            isWithdrawalWindowOpen={isWithdrawalWindowOpen}
            accrueInterest={accrueInterest}
          />
        </Container>
      </div>
    </div>
  );
};
