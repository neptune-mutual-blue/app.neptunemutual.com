import { fromNow } from "@/utils/formatter/relative-time";

describe("fromNow test", () => {
  test("Should return empty", () => {
    const date = fromNow();
    expect(date).toBe("");
  });
});
