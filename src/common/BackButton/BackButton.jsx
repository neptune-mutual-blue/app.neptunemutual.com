import { OutlinedButton } from "@/common/Button/OutlinedButton";
import LeftArrow from "@/icons/LeftArrow";
import { Trans } from "@lingui/macro";

export const BackButton = ({ onClick }) => (
  <OutlinedButton
    className="flex group items-center rounded-big pt-1 pb-1 pl-5 pr-4 border border-solid border-4E7DD9 md:py-3 md:pl-6 md:pr-5"
    onClick={onClick}
  >
    <span className="group-hover:hidden">
      <LeftArrow fill={"#4e7dd9"} className={"group-hover:text-black mr-2"} />
    </span>
    <span className="hidden group-hover:block">
      <LeftArrow fill={"#fff"} className={"group-hover:text-black mr-2"} />
    </span>
    <Trans>Back</Trans>
  </OutlinedButton>
);
