import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { CardBadge, E_CARD_STATUS } from "@/common/CardStatusBadge";

describe("CardStatusBadge component behaviour", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render normal without red color", () => {
    const screen = render(<CardBadge status={E_CARD_STATUS.NORMAL} />);
    const divElement = screen.getByText(/normal/i);
    const cardBadge = screen.container.getElementsByClassName("text-FA5C2F");
    expect(divElement).toBeInTheDocument();
    expect(cardBadge.length).toBe(0);
  });

  test("should render claimable with red color", () => {
    const screen = render(<CardBadge status={E_CARD_STATUS.CLAIMABLE} />);
    const divElement = screen.getByText(/Claimable/i);
    const cardBadge = screen.container.getElementsByClassName("bg-FA5C2F");

    console.log(divElement.outerHTML);
    expect(divElement).toBeInTheDocument();
    expect(cardBadge.length).toBe(1);
  });
});
