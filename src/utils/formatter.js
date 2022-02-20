import { getLocale } from "@/utils/locale";

export const formatAmount = (x) => {
  return new Intl.NumberFormat(getLocale(), {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: parseFloat(x) < 1 ? 6 : 2,
  }).format(x);
};
