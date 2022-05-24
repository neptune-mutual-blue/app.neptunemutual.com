import { render, screen } from "@testing-library/react";
import { NeutralButton } from "@/common/Button/NeutralButton";

describe("NeutralButton", () => {
  it("should have text content", () => {
    render(
      <NeutralButton onClick={() => {}} className="">
        Neutral Button
      </NeutralButton>
    );

    const heading = screen.getByRole("button", {
      name: "Neutral Button",
    });

    expect(heading).toBeInTheDocument();
  });
});
