import {
  waitFor,
  withDataProviders,
  withSorting,
} from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
import { MyLiquidityPage } from "@/modules/my-liquidity";
import { i18n } from "@lingui/core";
import { mockFetch } from "@/utils/unit-tests/mockApiRequest";
import * as envConfig from "@/src/config/environment";
import * as web3Core from "@web3-react/core";
import ReactDOM from "react-dom";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

const SELECTION = {
  CARD: "card",
  TITLE: "title",
  ASSURANCE: "assurance",
  LIQUIDITY: "liquidity",
};

const select = (container, type) => {
  if (type === SELECTION.CARD) {
    return Array.from(
      container.querySelectorAll('[data-testid="card-skeleton"]')
    );
  }
  if (type === SELECTION.TITLE) {
    return Array.from(container.querySelectorAll("[data-testid='title']"));
  }

  if (type === SELECTION.ASSURANCE) {
    return Array.from(container.querySelectorAll("[data-testid='assurance']"));
  }

  return Array.from(container.querySelectorAll("[data-testid='liquidity']"));
};

const getValues = (container, type) => {
  if (type === SELECTION.CARD) {
    return select(container, type).map((el) => el.textContent);
  }

  if (type === SELECTION.TITLE) {
    return select(container, type).map((el) => el.textContent);
  }

  if (type === SELECTION.ASSURANCE) {
    return select(container, type).map((el) =>
      parseFloat(el.textContent.slice(1), 10)
    );
  }

  return select(container, type).map((el) =>
    parseFloat(el.textContent.slice("APR: ".length), 10)
  );
};

jest.mock("next/link", () => {
  return ({ children }) => children;
});

describe("My Liquidity", () => {
  global.fetch = jest.fn(mockFetch);

  jest.spyOn(envConfig, "getNetworkId").mockImplementation(() => 80001);
  jest
    .spyOn(envConfig, "getGraphURL")
    .mockImplementation(
      () =>
        "https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-mumbai"
    );

  jest.spyOn(web3Core, "useWeb3React").mockImplementation(() => ({
    activate: jest.fn(async () => {}),
    deactivate: jest.fn(async () => {}),
    active: true,
    setError: jest.fn(async () => {}),
    library: undefined,
    account: "0xaC43b98FE7352897Cbc1551cdFDE231a1180CD9e",
  }));

  const router = createMockRouter({});
  const Component = withDataProviders(withSorting(MyLiquidityPage), router);
  const container = document.createElement("div");

  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
      ReactDOM.render(<Component />, container);
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(9));
  });

  describe("My Liquidity cards", () => {
    test("Cards should be 4", () => {
      const liquidityCards = select(container, SELECTION.CARD);

      expect(liquidityCards.length).toEqual(4);
    });

    test("No empty Title", () => {
      const titleValues = getValues(container, SELECTION.TITLE);

      const emptyValues = titleValues.filter((title) => title.length === 0);

      expect(titleValues.length).toEqual(4);
      expect(emptyValues.length).toEqual(0);
    });

    test("No Zero value Assurance", () => {
      const assuranceValues = getValues(container, SELECTION.ASSURANCE);

      const zeroValues = assuranceValues
        .map(Number)
        .filter((value) => value === 0);

      expect(assuranceValues.length).toEqual(4);
      expect(zeroValues.length).toEqual(0);
    });

    test("No Zero value Liquidity", () => {
      const liquidityValues = getValues(container, SELECTION.LIQUIDITY);

      const zeroValues = liquidityValues
        .map(Number)
        .filter((value) => value === 0);

      expect(liquidityValues.length).toEqual(4);
      expect(zeroValues.length).toEqual(0);
    });
  });
});
