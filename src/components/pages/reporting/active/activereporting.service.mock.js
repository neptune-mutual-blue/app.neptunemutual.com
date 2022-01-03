import { getActiveReportedList as getActiveReportedListMock } from "@/src/_mocks/reporting/active";
import { sleeper } from "@/src/_mocks/utils";

export const getActiveReportingList = async () => {
  await sleeper(500)();
  return getActiveReportedListMock();
};
