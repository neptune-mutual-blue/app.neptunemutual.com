import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { DoubleImage } from "@/common/DoubleImage";

describe("DataLoadingIndicator component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should have two images on the document", () => {
    const screen = render(
      <DoubleImage
        images={[
          { src: "/sTokenImgSrc.svg", alt: "stakingTokenSymbol" },
          { src: "/rTokenImgSrc.svg", alt: "rewardTokenSymbol" },
        ]}
      />
    );
    const noOfImgElement = screen.container.getElementsByTagName("img");
    expect(noOfImgElement.length).toEqual(2);
  });

  test("should have two images with src from props", () => {
    const screen = render(
      <DoubleImage
        images={[
          { src: "/sTokenImgSrc.svg", alt: "stakingTokenSymbol" },
          { src: "/rTokenImgSrc.svg", alt: "rewardTokenSymbol" },
        ]}
      />
    );
    const imageFirst = screen.getByAltText("stakingTokenSymbol");
    expect(imageFirst).toHaveAttribute("src", "/sTokenImgSrc.svg");
    const imageSecond = screen.getByAltText("rewardTokenSymbol");
    expect(imageSecond).toHaveAttribute("src", "/rTokenImgSrc.svg");
  });
});
