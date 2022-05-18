import { render, act, fireEvent, withProviders } from "@/utils/unit-tests/test-utils";
import { PoliciesExpiredPage } from "../PoliciesExpiredPage";
import { i18n } from '@lingui/core';
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

describe("PoliciesExpiredPage", () => {
  describe("should render PoliciesExpiredPage", () => {

    beforeAll(() => {
      act(() => {
        i18n.activate('en');
      });
    });

    test("it has Transaction List link", () => {
      const { getByText } = render(<PoliciesExpiredPage />);
      const TransactionListLink = getByText("Transaction List");
  
      expect(TransactionListLink).toHaveAttribute('href', '/my-policies/transactions');
    });

    test('when Transaction List link is clicked', () => {
      const router = createMockRouter({});
      const Component = withProviders(PoliciesExpiredPage, router);
      const { getByText } = render(<Component />);
      const TransactionListLink = getByText("Transaction List");

      fireEvent.click(TransactionListLink);

      expect(router.push).toHaveBeenCalledWith("/my-policies/transactions", "/my-policies/transactions", {"locale": undefined, "scroll": undefined, "shallow": undefined});
    });
    
  })
});
