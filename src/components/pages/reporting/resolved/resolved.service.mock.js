import { getResolvedReportingList as getResolvedReportingListMock } from "@/src/_mocks/reporting/resolved";
import { sleeper } from "@/src/_mocks/utils";

export const getResolvedReportingList = async () => {
  await sleeper(500)();
  return getResolvedReportingListMock();
};
