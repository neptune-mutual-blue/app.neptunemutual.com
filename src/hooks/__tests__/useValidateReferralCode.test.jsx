import { useValidateReferralCode } from "../useValidateReferralCode";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  referralCode: "1CODE",
};

const mockReturnData = {
  message: "ok",
};

describe("useValidateReferralCode", () => {
  test("trimmed has empty value", async () => {
    mockFn.useDebounce("");

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    );

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toEqual("");
    expect(result.isPending).toBe(false);
  });

  test("trimmed has value w/ error", async () => {
    mockFn.useDebounce("code");

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    );

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toEqual("Invalid Referral Code");
    expect(result.isPending).toBe(false);
  });

  test("while fetching successfully", async () => {
    mockFn.useDebounce("code");
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(
      useValidateReferralCode,
      [mockProps.referralCode],
      true
    );

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toEqual("");
    expect(result.isPending).toBe(false);
  });
});
