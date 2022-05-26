import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { Banner } from "@/common/Banner";

describe("Banner component behaviour", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render Banner", () => {
    const screen = render(<Banner />);
    const linkElemnt = screen.container.getElementsByTagName("a");
    expect(linkElemnt).toBeInTheDocument();
  });
});
