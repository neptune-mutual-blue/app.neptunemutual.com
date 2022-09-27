import { Trans } from "@lingui/macro";

export const renderTitleTranslation = (title) => {
  switch (title) {
    case "Purchase Policy":
      return <Trans>Purchase Policy</Trans>;
    case "Provide Liquidity":
      return <Trans>Provide Liquidity</Trans>;
    case "Report Incident":
      return <Trans>Report Incident</Trans>;
    case "Claim Cover":
      return <Trans>Claim Cover</Trans>;
    default:
      break;
  }
};

export const renderDescriptionTranslation = (description) => {
  switch (description) {
    case "to get protection from hacks & exploits":
      return <Trans>to get protection from hacks & exploits</Trans>;
    case "to pool risks and receive rewards":
      return <Trans>to pool risks and receive rewards</Trans>;
    case "to notify other users about the cover event":
      return <Trans>to notify other users about the cover event</Trans>;
    case "to receive payout by claiming cxTokens":
      return <Trans>to receive payout by claiming cxTokens</Trans>;
    default:
      break;
  }
};
