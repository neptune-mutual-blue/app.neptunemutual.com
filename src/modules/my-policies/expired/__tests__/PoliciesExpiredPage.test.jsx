import { render, act, cleanup } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { PoliciesExpiredPage } from "../PoliciesExpiredPage";
import { testData } from "@/utils/unit-tests/test-data";

describe("PoliciesExpiredPage", () => {
  beforeEach(() => {
    mockFn.useValidReport();

    act(() => {
      i18n.activate("en");
    });
  });

  test("should render PoliciesExpiredPage loading page", () => {
    cleanup();

    mockFn.useExpiredPolicies(() => {
      return {
        data: testData.useExpiredPolicies.data,
        loading: true,
      };
    });

    const { getAllByTestId, queryByTestId } = render(<PoliciesExpiredPage />);

    const ids = getAllByTestId("card-outline");
    expect(ids.length).toEqual(6);

    const empty = queryByTestId("empty-text");

    expect(empty).not.toBeInTheDocument();
  });

  test("should render PoliciesExpiredPage placeholder text", () => {
    cleanup();

    mockFn.useExpiredPolicies(() => {
      return {
        data: {
          expiredPolicies: [],
        },
        loading: false,
      };
    });

    const { getByTestId } = render(<PoliciesExpiredPage />);

    const empty = getByTestId("empty-text");

    expect(empty).toBeInTheDocument();
  });

  test("it has Transaction List link", () => {
    cleanup();

    mockFn.useExpiredPolicies(() => {
      return {
        data: {
          expiredPolicies: [],
        },
        loading: false,
      };
    });

    const { getByRole } = render(<PoliciesExpiredPage />);

    const TransactionListLink = getByRole("link", {
      name: /Transaction List/i,
    });

    expect(TransactionListLink).toHaveAttribute(
      "href",
      "/my-policies/transactions"
    );
  });

  test("Should have 1 card", () => {
    cleanup();

    mockFn.useExpiredPolicies();
    const { getAllByTestId } = render(<PoliciesExpiredPage />);

    const ids = getAllByTestId("card-outline");
    expect(ids.length).toEqual(1);
  });
});
