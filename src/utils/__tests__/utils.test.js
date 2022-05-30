const { toBN } = require("@/utils/bn");
const { classNames } = require("@/utils/classnames");
const { SORT_DATA_TYPES, sorter } = require("@/utils/sorting");
const { getReplacedString } = require("@/utils/string");

function createLetterObject(letter) {
  return {
    letter,
  };
}

function createBigNumber(value) {
  return {
    number: toBN(value),
  };
}
describe("Sort testing", () => {
  test("Sort alphabetically", () => {
    const testData = [
      createLetterObject("b"),
      createLetterObject("d"),
      createLetterObject("e"),
      createLetterObject("c"),
      createLetterObject("a"),
    ];

    const result = sorter({
      selector: (data) => data.letter,
      datatype: SORT_DATA_TYPES.STRING,
      list: testData.slice(0),
    });

    expect(result).not.toEqual(testData);
  });

  test("Sort numerically", () => {
    const testData = [
      createBigNumber(500),
      createBigNumber(333),
      createBigNumber(123),
      createBigNumber(155),
      createBigNumber(1666),
    ];

    const result = sorter({
      selector: (data) => data.number,
      datatype: SORT_DATA_TYPES.BIGNUMBER,
      list: testData.slice(0),
    });

    expect(result).not.toEqual(testData);
  });
});

describe("Class assignment", () => {
  const oldClassname = (...classes) => classes.filter(Boolean).join(" ");

  test("Backward compatibility class assignment", () => {
    const classList = classNames("test1 test2", "test3");

    expect(classList).toBe(oldClassname("test1 test2", "test3"));
  });

  test("Normal list of classes", () => {
    const classList = classNames("test1 test2", "   ", "test3", " ");

    expect(classList).toBe("test1 test2 test3");
  });

  test("Conditional classname assignment", () => {
    const dynamicClassname = `dynamic-${Math.floor(Math.random() * 10)}`;
    const classList = classNames({
      condition1: 1 == "1",
      condition2: 1 === "1",
      condition3: true,
      condition4: false,
      [dynamicClassname]: true,
    });

    expect(classList).toBe(`condition1 condition3 ${dynamicClassname}`);
  });

  test("Combination of string and conditional classname assignment", () => {
    const dynamicClassname = `dynamic-${Math.floor(Math.random() * 10)}`;

    const classList = classNames("string1", "  ", "string2", "", "string3", {
      condition1: 1 == "1",
      condition2: 1 === "1",
      condition3: true,
      condition4: false,
      [dynamicClassname]: true,
    });

    expect(classList).toBe(
      `string1 string2 string3 condition1 condition3 ${dynamicClassname}`
    );
  });
});

describe("getReplacedString", () => {
  test("test replace", () => {
    const replacement = {
      account: "me",
      action: "add",
    };
    const string = "https://sample.url/feature/{account}/section/{action}";
    const expected = `https://sample.url/feature/${replacement.account}/section/${replacement.action}`;
    const result = getReplacedString(string, replacement);

    expect(result).toBe(expected);
  });
});