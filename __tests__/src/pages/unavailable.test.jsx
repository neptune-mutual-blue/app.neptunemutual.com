import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import PageNotAvailable from "@/pages/unavailable";

describe("Unavailable test", () => {
  const { initialRender } = initiateTest(PageNotAvailable);

  beforeEach(() => {
    initialRender();
  });

  test("should display unavailable page", () => {
    const message = screen.getByText(
      "Oops, Neptune Mutual is not available in your region"
    );
    expect(message).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images[1]).toHaveAttribute("src", "/unavailable.svg");
  });
});
