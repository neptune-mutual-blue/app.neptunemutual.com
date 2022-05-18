import { screen } from "@testing-library/react";
import { render } from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
// import { Content } from "./Content";
import { contracts, covers, pricing } from "./mockUpdata.data";
import { API_BASE_URL } from "@/src/config/constants";
import { i18n } from "@lingui/core";
import { StakingPage } from "@/modules/pools/staking";

const MOCKUP_API_URLS = {
  POOL_INFO_URL: `${API_BASE_URL}protocol/staking-pools/info/`,
  GET_CONTRACTS_INFO_URL: "/protocol/contracts/",
};

async function mockFetch(url) {
  if (url.startsWith(MOCKUP_API_URLS.POOL_INFO_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => covers,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_CONTRACTS_INFO_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => contracts,
    };
  }

  if (url.startsWith(MOCKUP_API_URLS.FINANCING)) {
    return {
      ok: true,
      status: 200,
      json: async () => pricing,
    };
  }

  throw new Error(`Unhandled request: ${url}`);
}

global.fetch = jest.fn(mockFetch);

describe("Pool Staking", () => {
  it("Should render Sort Dropdown", async () => {
    act(() => i18n.activate("en"));

    await act(async () => render(<StakingPage />));

    const cover = screen.getByText("Sort by: A-Z");

    expect(cover).toBeInTheDocument();
  });
});
