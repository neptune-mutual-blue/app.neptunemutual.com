import { API_BASE_URL } from "@/src/config/constants";
import { useDebounce } from "@/src/hooks/useDebounce";
import { fetchApi } from "@/src/services/fetchApi.js";
import { t } from "@lingui/macro";
import { utils } from "@neptunemutual/sdk";
import { useState, useEffect } from "react";

// creates a cancellable request
const fetchValidateReferralCode = fetchApi("fetchValidateReferralCode");

// needs to be outside of react to keep debounce reference
// wraps cancellable request with a debounce
async function validateReferralCode(referralCode) {
  try {
    const result = await fetchValidateReferralCode(
      `${API_BASE_URL}protocol/cover/referral-code`,
      {
        method: "POST",
        body: JSON.stringify({ referralCode }),
      }
    );

    // status 401 is a valid request rejection
    // try catch won't work here
    return result?.message.toLowerCase() === "ok";
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param {string} referralCode
 * @returns {boolean}
 */
function isValidReferralCode(referralCode) {
  try {
    utils.keyUtil.toBytes32(referralCode.trim());
    return true;
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param {string} referralCode
 * @returns {[boolean, string]}
 */
export function useValidateReferralCode(referralCode) {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const finalReferralValue = useDebounce(referralCode, 400);

  // immidiately disables approval button
  useEffect(() => {
    setIsValid(false);
  }, [referralCode]);

  useEffect(() => {
    (async () => {
      const sanitizedValue = finalReferralValue.trim();
      // if there's a value we check it
      if (sanitizedValue.length) {
        if (isValidReferralCode(sanitizedValue)) {
          // immediately disable submit button
          const isValidRef = await validateReferralCode(sanitizedValue);

          setIsValid(isValidRef);
          if (isValidRef) {
            setErrorMessage("");
            return;
          }

          setErrorMessage(t`Invalid Referral Code`);

          return;
        }
        setErrorMessage(t`Incorrect Referral Code`);
        setIsValid(false);
        return;
      }

      // if it's empty we set true immediately
      setErrorMessage("");
      setIsValid(true);
    })();

    return () => {
      fetchValidateReferralCode.abort();
    };
  }, [finalReferralValue]);

  return [isValid, errorMessage];
}
