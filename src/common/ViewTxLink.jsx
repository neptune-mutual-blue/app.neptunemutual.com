import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { Trans } from "@lingui/macro";

export const ViewTxLink = ({ txLink }) => {
  return (
    <a
      className="flex"
      target="_blank"
      rel="noopener noreferrer nofollow"
      href={txLink}
    >
      <span className="inline-block">
        <Trans>View transaction</Trans>
      </span>
      <OpenInNewIcon className="w-4 h-4 ml-2" fill="currentColor" />
    </a>
  );
};
