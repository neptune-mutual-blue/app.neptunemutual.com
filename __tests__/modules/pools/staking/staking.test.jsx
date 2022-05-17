import { screen } from "@testing-library/react";
import { render } from "@/utils/unit-tests/test-utils";
import { act } from "react-dom/test-utils";
import { Content } from "./common/Content";
import { covers } from "./data/mockUpdata.data";
import { POOL_INFO_URL } from "@/src/config/constants";

const MOCKUP_API_URLS = {
  COVERS: POOL_INFO_URL,
};

async function mockFetch(url) {
  switch (url) {
    case MOCKUP_API_URLS.COVERS:
      return {
        ok: true,
        status: 200,
        json: async () => covers,
      };
    default:
      throw new Error(`Unhandled request: ${url}`);
  }
}

describe("Staking", () => {
  it("Should render 6 covers", async () => {
    jest.spyOn(window, "fetch").mockImplementationOnce(mockFetch);

    const getPriceByAddress = (_key) => Math.floor(Math.random() * 9999);

    await act(() =>
      render(
        <Content
          data={covers}
          loading={false}
          hasMore={false}
          handleShowMore={() => {}}
          getPriceByAddress={getPriceByAddress}
        />
      )
    );

    console.log(screen.findAllByLabelText("OBK Staking"));
    const cover = screen.getByRole("grid");
    // console.log(cover);

    expect(cover).toBeInTheDocument();
  });
});

/**


// overrides window fetch implementation
*/
