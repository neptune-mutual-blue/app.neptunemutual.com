import { useState } from "react";
import { useRouter } from "next/router";
import { OutlinedButton } from "@/common/Button/OutlinedButton";
import { isGreater } from "@/utils/bn";
import { useLiquidityFormsContext } from "@/common/LiquidityForms/LiquidityFormsContext";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { Trans } from "@lingui/macro";
import { WithdrawLiquidityModal } from "@/modules/my-liquidity/content/WithdrawLiquidityModal";
import { ModalTitle } from "@/common/Modal/ModalTitle";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { DedicatedLiquidityResolutionSources } from "@/common/LiquidityResolutionSources/DedicatedLiquidityResolutionSources";
import { DiversifiedLiquidityResolutionSources } from "@/common/LiquidityResolutionSources/DiversifiedLiquidityResolutionSources";

export const LiquidityResolutionSources = ({
  isDiversified,
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

  const { myStake, podBalance } = useLiquidityFormsContext();

  const imgSrc = getCoverImgSrc({ key: coverKey });

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="col-span-3 row-start-2 md:col-auto md:row-start-auto">
      {isDiversified ? (
        <DiversifiedLiquidityResolutionSources info={info}>
          <WithdrawLiquidityButton
            onOpen={onOpen}
            myStake={myStake}
            podBalance={podBalance}
          />
        </DiversifiedLiquidityResolutionSources>
      ) : (
        <DedicatedLiquidityResolutionSources coverInfo={coverInfo} info={info}>
          <WithdrawLiquidityButton
            onOpen={onOpen}
            myStake={myStake}
            podBalance={podBalance}
          />
        </DedicatedLiquidityResolutionSources>
      )}
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
          <ModalTitle imgSrc={isDiversified ? null : imgSrc}>
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

const WithdrawLiquidityButton = ({ onOpen, myStake, podBalance }) => {
  return (
    <>
      {isGreater(myStake, "0") && isGreater(podBalance, "0") && (
        <div className="flex justify-center mt-8 px-7">
          <OutlinedButton
            className="text-sm font-medium leading-5 rounded-big"
            onClick={onOpen}
          >
            <Trans>Withdraw Liquidity</Trans>
          </OutlinedButton>
        </div>
      )}
    </>
  );
};
