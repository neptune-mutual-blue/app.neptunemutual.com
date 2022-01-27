export const IncidentReportStatus = ({ status }) => {
  switch (status) {
    case "Reporting":
      return "Reporting";

    case "Claimable":
      return "Claimable";

    case "FalseReporting":
      return "False Reporting";
  }

  return status;
};
