import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import ClaimPolicyDiversifiedProduct from "@/src/pages/my-policies/[cover_id]/product/[product_id]/[timestamp]/claim";
import { screen } from "@testing-library/react";

jest.mock("@/modules/my-policies/ClaimDetailsPage", () => {
  return {
    ClaimDetailsPage: ({ disabled }) => {
      return (
        <div data-testid="claim-details-page">{disabled && "Coming soon!"}</div>
      );
    },
  };
});

describe("ClaimPolicyDiversifiedProduct test", () => {
  const { initialRender } = initiateTest(ClaimPolicyDiversifiedProduct);

  beforeEach(() => {
    initialRender();
  });

  test("should display ClaimPolicyDiversifiedProduct component", () => {
    const policies = screen.getByTestId("claim-details-page");
    expect(policies).toBeInTheDocument();
  });
});
