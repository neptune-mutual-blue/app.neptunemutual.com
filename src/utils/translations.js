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

export const renderStatusIndicatorTranslation = (status) => {
  switch (status) {
    case "Stopped":
      return <Trans>Stopped</Trans>;
    case "Normal":
      return <Trans>Normal</Trans>;
    case "Claimable":
      return <Trans>Claimable</Trans>;
    case "Incident Happened":
      return <Trans>Incident Happened</Trans>;
    case "False Reporting":
      return <Trans>False Reporting</Trans>;
    default:
      break;
  }
};

export const renderMonthLabel = (month) => {
  switch (month) {
    case "January":
      return <Trans>January</Trans>;
    case "February":
      return <Trans>February</Trans>;
    case "March":
      return <Trans>March</Trans>;
    case "April":
      return <Trans>April</Trans>;
    case "May":
      return <Trans>May</Trans>;
    case "June":
      return <Trans>June</Trans>;
    case "July":
      return <Trans>July</Trans>;
    case "August":
      return <Trans>August</Trans>;
    case "September":
      return <Trans>September</Trans>;
    case "October":
      return <Trans>October</Trans>;
    case "November":
      return <Trans>November</Trans>;
    case "December":
      return <Trans>December</Trans>;
    default:
      break;
  }
};
