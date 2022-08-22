import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import ClaimPolicyDedicatedCover from "@/src/pages/my-policies/[cover_id]/[timestamp]/claim";
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

describe("ClaimPolicyDedicatedCover test", () => {
  const { initialRender, rerenderFn } = initiateTest(ClaimPolicyDedicatedCover);

  beforeEach(() => {
    initialRender();
  });

  test("should display ClaimPolicyDedicatedCover component", () => {
    const policies = screen.getByTestId("claim-details-page");
    expect(policies).toBeInTheDocument();
  });

  test("Should display coming soon", () => {
    rerenderFn({ disabled: true });

    const comingSoon = screen.getByText("Coming soon!");
    expect(comingSoon).toBeInTheDocument();
  });
});
