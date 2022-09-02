import { getNumberSeparators } from "@/src/utils/formatter/input";

describe("getNumberSeparators test", () => {
  test("Get Number Separator without sending parameters ", () => {
    const seperator = getNumberSeparators();
    expect(seperator).toMatchObject({ thousand: ",", decimal: "." });
  });
});
