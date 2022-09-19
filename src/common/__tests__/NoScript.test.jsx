import { NoScript } from "@/common/NoScript";
import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

describe("NoScript component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
    });
  });

  test("should render error if occured", () => {
    const screen = render(<NoScript />);
    expect(screen.container.getElementsByTagName("noscript").length).toBe(1);
  });
});
