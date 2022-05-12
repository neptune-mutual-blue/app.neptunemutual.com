import React from "react";
import { render } from "@/utils/unit-tests/test-utils";

import { UnlockDate } from "@/common/UnlockDate";

describe("Date", () => {
  it("renders Unlock Date string", () => {
    render(<UnlockDate />);

    // const title = screen.getByText("Unlock Date");

    // expect(title).toBeInTheDocument();
  });
});

