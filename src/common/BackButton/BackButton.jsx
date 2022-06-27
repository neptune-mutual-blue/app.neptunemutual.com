import { OutlinedButton } from "@/common/Button/OutlinedButton";
import LeftArrow from "@/icons/LeftArrow";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";

export const BackButton = ({ onClick, className = "" }) => (
  <OutlinedButton
    className={classNames(
      "flex group items-center rounded-big pt-1 pb-1 pl-5 pr-4 border border-solid border-4E7DD9 md:py-3 md:pl-6 md:pr-5",
      className
    )}
    onClick={onClick}
  >
    <LeftArrow />
    <Trans>Back</Trans>
  </OutlinedButton>
);
