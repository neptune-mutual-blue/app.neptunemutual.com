import { getActivePolicy as getActivePolicyMock } from "@/src/_mocks/policy/activePolicy";

export const getActivePolicy = async () => {
  return getActivePolicyMock();
};
