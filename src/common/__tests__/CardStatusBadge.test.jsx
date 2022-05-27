import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { CardStatusBadge } from "@/common/CardStatusBadge";

describe("CardStatusBadge component behaviour", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render normal without red color", () => {
    const screen = render(<CardStatusBadge status={"normal"} />);
    const divElement = screen.getByText(/normal/i);
    const cardBadge = screen.container.getElementsByClassName("text-FA5C2F");
    expect(divElement).toBeInTheDocument();
    expect(cardBadge.length).toBe(0);
  });

  test("should render claimable with red color", () => {
    const screen = render(<CardStatusBadge status={"Claimable"} />);
    const divElement = screen.getByText(/Claimable/i);
    const cardBadge = screen.container.getElementsByClassName("text-FA5C2F");
    expect(divElement).toBeInTheDocument();
    expect(cardBadge.length).toBe(1);
  });
});
