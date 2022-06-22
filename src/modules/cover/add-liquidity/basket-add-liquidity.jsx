import { useRouter } from "next/router";
import { ProvideLiquidityForm } from "@/common/LiquidityForms/ProvideLiquidityForm";
import { Container } from "@/common/Container/Container";
import { useMyLiquidityInfo } from "@/src/hooks/provide-liquidity/useMyLiquidityInfo";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { LiquidityResolutionSources } from "@/common/LiquidityResolutionSources/LiquidityResolutionSources";

const info = {
  stablecoin: "0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB",
  vault: "0x7a3c82C43eFCE36B144E4dB0c696f3F23526FB36",
  podTotalSupply: "2927746969334223067760118",
  myPodBalance: "0",
  vaultStablecoinBalance: "2780718708749997848223672",
  vaultTokenSymbol: "nDAI",
  stablecoinTokenSymbol: "DAI",
  withdrawalOpen: "1655060063",
  withdrawalClose: "1655063663",
  totalReassurance: "1248515000000000000000000",
  myStake: "0",
  isAccrualComplete: false,
  amountLentInStrategies: "146353616249999886748614",
  minStakeToAddLiquidity: "250000000000000000000",
  myShare: "0",
  myUnrealizedShare: "0",
  totalLiquidity: "2927072324999997734972286",
};

export const CoverAddLiquidityDetailsPage = () => {
  const router = useRouter();
  const { cover_id = "" } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String("");
  // const coverInfo = useCoverOrProductData({ coverKey, productKey });

  const coverInfo = {
    projectName: "Animated brands",
    resolutionSources: [],
  };

  const {
    refetch: refetchInfo,
    isWithdrawalWindowOpen,
    accrueInterest,
  } = useMyLiquidityInfo({
    coverKey,
  });

  return (
    <>
      {/* Content */}
      <div className="pt-12 pb-24">
        <Container className="grid grid-cols-3 md:gap-32">
          <div className="col-span-3 md:col-span-2">
            <div className="mt-12">
              <ProvideLiquidityForm coverKey={coverKey} info={info} />
            </div>
          </div>

          <LiquidityResolutionSources
            info={info}
            coverInfo={coverInfo}
            refetchInfo={refetchInfo}
            isWithdrawalWindowOpen={isWithdrawalWindowOpen}
            accrueInterest={accrueInterest}
          />
        </Container>
      </div>
    </>
  );
};
