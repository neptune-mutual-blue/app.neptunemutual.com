import { getLocale } from "@/utils/locale";

export const formatPercent = (x) => {
  if (!x) {
    return "";
  }

  return new Intl.NumberFormat(getLocale(), {
    style: "percent",
    maximumFractionDigits: x < 1 ? 6 : 2,
  }).format(x);
};
