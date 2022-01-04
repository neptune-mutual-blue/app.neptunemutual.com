import { getActiveReportedList as getActiveReportedListMock } from "@/src/_mocks/reporting/active";
import { sleeper } from "@/src/_mocks/utils";

export const getActiveReportingList = async () => {
  await sleeper(500)();
  return getActiveReportedListMock();
};

export const showOrHideActiveReporting = () => {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  let randomNumber = randomBuffer[0] / (0xffffffff + 1);
  //didnt return bollean false when 0 so returned string false
  if (Math.floor(randomNumber * 10) % 2 === 0) {
    return "false";
  } else return "true";
};
