import { escapeRegExp } from "./escapeRegExp";

/**
 * Remove invalid characters
 */
export const removeInvalidChars = (value, validChars) => {
  const chars = escapeRegExp(validChars.join(""));
  const reg = new RegExp(`[^\\d${chars}]`, "gi");
  return value.replace(reg, "");
};
