import {
  render,
  act,
  fireEvent,
  withProviders,
} from "@/utils/unit-tests/test-utils";
import { PoliciesActivePage } from "../PoliciesActivePage";
import { i18n } from "@lingui/core";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

// mock api call
const getMockActivePolicies = async () => {
  try {
    const res = await fetch(
      "https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-mumbai",
      {
        method: "POST",
        body: JSON.stringify({
          query: `
        {
          userPolicies(
            where: {
              expiresOn_gt: 1651363200
              account: 0x767AaA0A901f865E80D0FE9841f34a2239a1F8c0
            }
          ) {
            id
            cxToken {
              id
              creationDate
              expiryDate
            }
            totalAmountToCover
            expiresOn
            cover {
              id
            }
          }
        }
        `,
        }),
      }
    );
    const json = await res.json();

    return json;
  } catch (error) {
    return null;
  }
};

// mock response
const mockActivePolicies = [
  {
    cover: {
      id: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
    },
    cxToken: {
      creationDate: "1650037062",
      expiryDate: "1656633599",
      id: "0x0e41e45e9067c30cc64787b7dc996843ca96145e",
      expiresOn: "1656633599",
      id: "0x767aaa0a901f865e80d0fe9841f34a2239a1f8c0-0x0e41e45e9067c30cc64787b7dc996843ca96145e-1656633599",
      totalAmountToCover: "2200000000000000000000",
    },
  },
];

const unmockedFetch = global.fetch;

describe("PoliciesActivePage", () => {
  describe("should render PoliciesActivePage", () => {
    beforeAll(() => {
      act(() => {
        i18n.activate("en");
      });

      global.fetch = () =>
        Promise.resolve({
          json: () => Promise.resolve(mockActivePolicies),
        });
    });

    afterAll(() => {
      global.fetch = unmockedFetch;
    });

    test("it has Transaction List link", () => {
      const { getByRole } = render(<PoliciesActivePage />);
      const TransactionListLink = getByRole("link", {
        name: /Transaction List/i,
      });

      expect(TransactionListLink).toHaveAttribute(
        "href",
        "/my-policies/transactions"
      );
    });

    test("when Transaction List link is clicked", () => {
      const router = createMockRouter({});
      const Component = withProviders(PoliciesActivePage, router);
      const { getByRole } = render(<Component />);
      const TransactionListLink = getByRole("link", {
        name: /Transaction List/i,
      });

      fireEvent.click(TransactionListLink);

      expect(router.push).toHaveBeenCalledWith(
        "/my-policies/transactions",
        "/my-policies/transactions",
        { locale: undefined, scroll: undefined, shallow: undefined }
      );
    });

    test("fetch active policies and render policy card ", async () => {
      const activePolicies = await getMockActivePolicies();

      expect(activePolicies).toEqual(mockActivePolicies);
    });

    test("should placeholder when no active policies", () => {
      const { getByText, getByAltText } = render(<PoliciesActivePage />);
      const text =
        "A cover policy enables you to claim and receive payout when an incident occurs. To purchase a policy, select a cover from the home screen.";
      const placeholderText = getByText((content, node) => {
        const hasText = (node) => node.textContent === text;
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
          (child) => !hasText(child)
        );

        return nodeHasText && childrenDontHaveText;
      });
      const placeholderImage = getByAltText("no data found");

      expect(placeholderText).toBeInTheDocument();
      expect(placeholderImage).toBeInTheDocument();
    });
  });
});
