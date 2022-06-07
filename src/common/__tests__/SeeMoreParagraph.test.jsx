import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";

describe("SeeMoreParagrapgh component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should not render see more button", () => {
    const screen = render(
      <SeeMoreParagraph
        text={
          "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019."
        }
      />
    );
    const seemoreBtn = screen.container.getElementsByTagName("button");
    expect(seemoreBtn.length).toEqual(0);
  });
});
