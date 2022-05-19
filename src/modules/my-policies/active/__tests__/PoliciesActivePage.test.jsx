import { render, act, fireEvent, withProviders } from "@/utils/unit-tests/test-utils";
import { PoliciesActivePage } from "../PoliciesActivePage";
import { i18n } from '@lingui/core';
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

describe("PoliciesActivePage", () => {
  describe("should render PoliciesActivePage", () => {

    beforeAll(() => {
      act(() => {
        i18n.activate('en');
      });
    });

    test("it has Transaction List link", () => {
      const { getByText } = render(<PoliciesActivePage />);
      const TransactionListLink = getByText("Transaction List");
  
      expect(TransactionListLink).toHaveAttribute('href', '/my-policies/transactions');
    });

    test('when Transaction List link is clicked', () => {
      const router = createMockRouter({});
      const Component = withProviders(PoliciesActivePage, router);
      const { getByText } = render(<Component />);
      const TransactionListLink = getByText("Transaction List");

      fireEvent.click(TransactionListLink);

      expect(router.push).toHaveBeenCalledWith("/my-policies/transactions", "/my-policies/transactions", {"locale": undefined, "scroll": undefined, "shallow": undefined});
    });
    
  })
});
