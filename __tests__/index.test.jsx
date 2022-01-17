import { render } from "@testing-library/react";
import Home from "@/src/pages";

describe("Home", () => {
  it("renders homepage", () => {
    render(<Home />);

    const title = screen.getByLabelText("Available Covers");

    expect(title).toBeInTheDocument();
  });
});
