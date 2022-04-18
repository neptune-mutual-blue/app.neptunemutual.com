import React from "react";

import { screen } from "@testing-library/react";
import { render } from "@/utils/test-utils";

import { UnlockDate } from "@/src/common/components/UnlockDate";

describe("Date", () => {
  it("renders Unlock Date string", () => {
    render(<UnlockDate />);

    const title = screen.getByText("Unlock Date");

    expect(title).toBeInTheDocument();
  });
});
