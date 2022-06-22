import { useState } from "react";
import { useRouter } from "next/router";
import { CoverResolutionSources } from "@/common/Cover/CoverResolutionSources";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { OutlinedButton } from "@/common/Button/OutlinedButton";
import { isGreater } from "@/utils/bn";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { Trans } from "@lingui/macro";
import { WithdrawLiquidityModal } from "@/src/modules/my-liquidity/WithdrawLiquidityModal";
import { ModalTitle } from "@/common/Modal/ModalTitle";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useAppConstants } from "@/src/context/AppConstants";

export const LiquidityResolutionSources = ({
  coverInfo,
  info,
  refetchInfo,
  isWithdrawalWindowOpen,
  accrueInterest,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);

  const { liquidityTokenDecimals } = useAppConstants();
  const { myStake, podBalance } = useLiquidityFormsContext();

  const totalLiquidity = info.totalLiquidity;
  const reassuranceAmount = info.totalReassurance;

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="col-span-3 row-start-2 md:col-auto md:row-start-auto">
      <CoverResolutionSources coverInfo={coverInfo}>
        <hr className="mt-4 mb-6 border-t border-B0C4DB/60" />
        <div
          className="flex justify-between pb-2"
          title={
            formatCurrency(
              convertFromUnits(totalLiquidity, liquidityTokenDecimals),
              router.locale
            ).long
          }
        >
          <span className="">
            <Trans>Total Liquidity:</Trans>
          </span>
          <strong className="font-bold text-right">
            {
              formatCurrency(
                convertFromUnits(totalLiquidity, liquidityTokenDecimals),
                router.locale
              ).short
            }
          </strong>
        </div>
        <div
          className="flex justify-between pb-8"
          title={
            formatCurrency(
              convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
              router.locale
            ).long
          }
        >
          <span className="">
            <Trans>Reassurance:</Trans>
          </span>
          <strong className="font-bold text-right">
            {
              formatCurrency(
                convertFromUnits(reassuranceAmount, liquidityTokenDecimals),
                router.locale
              ).short
            }
          </strong>
        </div>

        {isGreater(myStake, "0") && isGreater(podBalance, "0") && (
          <div className="flex justify-center px-7">
            <OutlinedButton
              className="text-sm font-medium leading-5 rounded-big"
              onClick={onOpen}
            >
              <Trans>Withdraw Liquidity</Trans>
            </OutlinedButton>
          </div>
        )}
      </CoverResolutionSources>
      <div className="flex justify-end">
        {isWithdrawalWindowOpen && (
          <button
            className="mt-4 mr-2 text-sm text-4e7dd9 hover:underline disabled:hover:no-underline"
            onClick={accrueInterest}
          >
            <Trans>Accrue</Trans>
          </button>
        )}
      </div>

      <WithdrawLiquidityModal
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>
            <Trans>Withdraw Liquidity</Trans>
          </ModalTitle>
        }
        onClose={onClose}
        isOpen={isOpen}
        info={info}
        refetchInfo={refetchInfo}
      />
    </div>
  );
};
