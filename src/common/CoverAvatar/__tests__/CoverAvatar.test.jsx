import { screen, act, render } from "@/utils/unit-tests/test-utils";
import { testData } from "@/utils/unit-tests/test-data";
import { i18n } from "@lingui/core";
import { CoverAvatar } from "@/common/CoverAvatar/CoverAvatar";

describe("CoverAvatar component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should return null if there is no coverinfo", () => {
    render(<CoverAvatar />);
    const divElement = screen.queryByTestId("cover-img");
    expect(divElement).not.toBeInTheDocument();
  });

  test("should show single img if cover is not diversified", () => {
    render(
      <CoverAvatar coverInfo={testData.coverInfo} isDiversified={false} />
    );
    const divElement = screen.getByTestId("cover-img");
    expect(divElement).toBeInTheDocument();
  });

  test("should show different images according to number of products if cover is diversified", () => {
    render(
      <CoverAvatar
        coverInfo={testData.coverInfoWithProducts}
        isDiversified={true}
      />
    );
    const images = screen.getAllByTestId("cover-img");
    expect(images.length).toEqual(
      testData.coverInfoWithProducts.products.length > 3
        ? 3
        : testData.coverInfoWithProducts.products.length
    );
  });

  test("should have More if the products length is more than 3", () => {
    render(
      <CoverAvatar
        coverInfo={testData.coverInfoWithProducts}
        isDiversified={true}
      />
    );
    const moreText = screen.getByText(/MORE/i);
    expect(moreText).toBeInTheDocument();
  });
});
