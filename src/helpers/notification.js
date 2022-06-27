import { METHODS } from "@/src/services/transactions/const";
import { STATUS } from "@/src/services/transactions/transaction-history";
import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { t } from "@lingui/macro";

/**
 *
 * @type {Object.<string, (status: number, data: any, locale: string) => ({ title: string, description: string })>}
 */
const actionMessages = {
  [METHODS.CLAIM_COVER_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || "";
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} tokens Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: "",
      };
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: "" };
  },
  [METHODS.CLAIM_COVER_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Claimed policy Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not Claim policy`,
        description: "",
      };
    }

    return { title: t`Claiming policy`, description: "" };
  },
  [METHODS.REPORT_INCIDENT_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || "";
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} tokens Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not approve ${tokenSymbol} tokens`,
        description: "",
      };
    }

    return { title: t`Approving ${tokenSymbol} tokens`, description: "" };
  },
  [METHODS.REPORT_INCIDENT_COMPLETE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Reported incident successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return {
        title: t`Could not report incident`,
        description: "",
      };
    }

    return { title: t`Reporting incident`, description: "" };
  },
  [METHODS.POLICY_APPROVE]: (status, _data) => {
    const tokenSymbol = _data.tokenSymbol || "";
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved ${tokenSymbol} Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not approve ${tokenSymbol}`, description: "" };
    }

    return { title: t`Approving ${tokenSymbol}`, description: "" };
  },
  [METHODS.POLICY_PURCHASE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Purchased Policy Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not purchase policy`, description: "" };
    }

    return { title: t`Purchasing Policy`, description: "" };
  },
  [METHODS.BOND_APPROVE]: (status, _data) => {
    if (status === STATUS.SUCCESS) {
      return {
        title: t`Approved LP tokens Successfully`,
        description: "",
      };
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not approve LP tokens`, description: "" };
    }

    return { title: t`Approving LP tokens`, description: "" };
  },
  [METHODS.BOND_CREATE]: (status, data, locale) => {
    if (status === STATUS.SUCCESS) {
      const symbol = data.tokenSymbol;
      return {
        title: t`Created bond successfully`,
        description: formatCurrency(
          convertFromUnits(data.receiveAmount || "").toString(),
          locale,
          symbol,
          true
        ).long,
      };
    }

    if (status === STATUS.FAILED) {
      return { title: t`Could not create bond`, description: "" };
    }

    return { title: t`Creating bond`, description: "" };
  },
  generic: (_status, _data) => {
    return { title: t`Notification`, description: "" };
  },
};

/**
 *
 * @param {import('@/src/services/transactions/const').E_METHODS} methodName
 * @param {number} status
 * @param {any} [data]
 * @returns {{ title: string, description: string }}
 */
export function getActionMessage(methodName, status, data = {}, locale = "en") {
  if (actionMessages.hasOwnProperty(methodName)) {
    return actionMessages[methodName](status, data, locale);
  }

  return actionMessages.generic(status, data, locale);
}
