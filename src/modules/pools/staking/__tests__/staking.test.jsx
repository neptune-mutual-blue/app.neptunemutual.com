import {
  fireEvent,
  waitFor,
  withDataProviders,
  withSorting,
} from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
import { StakingPage } from "@/modules/pools/staking";
import { i18n } from "@lingui/core";
import ReactDOM from "react-dom";
import { mockFetch } from "@/utils/unit-tests/mockApiRequest";

describe("Pool Staking", () => {
  global.fetch = jest.fn(mockFetch);

  const Component = withDataProviders(withSorting(StakingPage));
  const container = document.createElement("div");

  beforeAll(async () => {
    act(() => {
      i18n.activate("en");
      ReactDOM.render(<Component />, container);
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(11));
  });

  describe("Staking card", () => {
    test("Card should be 6", () => {
      const stakeCards = select(container, SELECTION.TITLE);

      expect(stakeCards.length).toEqual(6);
    });

    describe("TVL", () => {
      test("should be 6", () => {
        const tvlElements = select(container, SELECTION.TVL);
        expect(tvlElements.length).toEqual(6);
      });

      test("no 0 value", () => {
        const tvlValues = getValues(container, SELECTION.TVL);

        const zeroValues = tvlValues.filter((value) => value === 0);

        expect(zeroValues.length).toEqual(0);
      });
    });

    describe("APR", () => {
      test("should be 6", () => {
        const aprElements = select(container, SELECTION.APR);
        expect(aprElements.length).toEqual(6);
      });

      test("no 0 value", () => {
        const aprValues = getValues(container, SELECTION.APR);
        const zeroValues = aprValues.filter((value) => value === 0);

        expect(zeroValues.length).toEqual(0);
      });
    });

    describe("Sorting", () => {
      test("Sorting is visible", () => {
        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        expect(container).toContainElement(sortList);
      });

      test("Sort Alphabetically", () => {
        const original = getValues(container, SELECTION.TITLE);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.select(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [alphabet] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(alphabet);
        });

        const values = getValues(container, SELECTION.TITLE);

        expect(original).toEqual(values);
      });

      test("Sort by TVL", () => {
        const original = getValues(container, SELECTION.TVL);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [_, tvl] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(tvl);
        });

        const values = getValues(container, SELECTION.TVL);
        const sortedOriginal = [...original].sort(sortFromHighest);

        expect(original).not.toEqual(values);
        expect(sortedOriginal).toEqual(values);
      });

      test("Sort by APR", () => {
        const original = getValues(container, SELECTION.APR);

        const sortButton = container.querySelector("button");

        act(() => {
          fireEvent.click(sortButton);
        });

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        );

        const [_, _tvl, apr] = Array.from(sortList.querySelectorAll("li"));

        act(() => {
          fireEvent.click(apr);
        });

        const values = getValues(container, SELECTION.APR);
        const sortedOriginal = [...original].sort(sortFromHighest);

        expect(original).not.toEqual(values);
        expect(sortedOriginal).toEqual(values);
      });
    });
  });
});

const SELECTION = {
  TITLE: "title",
  TVL: "tvl",
  APR: "apr",
};

const select = (container, type) => {
  if (type === SELECTION.TITLE) {
    return Array.from(container.querySelectorAll("h4"));
  }

  if (type === SELECTION.TVL) {
    return Array.from(
      container.querySelectorAll(".text-right[title] p.text-7398C0")
    );
  }

  return Array.from(container.querySelectorAll(".text-21AD8C"));
};

const getValues = (container, type) => {
  if (type === SELECTION.TITLE) {
    return select(container, type).map((el) => el.textContent);
  }

  if (type === SELECTION.TVL) {
    return select(container, type).map((el) =>
      parseFloat(el.textContent.slice(1), 10)
    );
  }

  return select(container, type).map((el) =>
    parseFloat(el.textContent.slice("APR: ".length), 10)
  );
};

const sortFromHighest = (a, b) => {
  if (a === b) {
    return 0;
  }

  return a > b ? -1 : 1;
};
