import DateLib from "@/lib/date/DateLib";

describe("DateLib methods", () => {
  test("unix, fromUnix, toUnix", () => {
    const unix = DateLib.unix();

    const flooredNow = Math.floor(Date.now() / 1000) * 1000;

    const currentTime = new Date(flooredNow);
    const currentNow = new Date(flooredNow).getTime();

    const fromUnix = DateLib.fromUnix(unix);
    const toUnix = DateLib.toUnix(currentTime);

    expect(typeof unix).toBe("number");
    expect(fromUnix instanceof Date).toBeTruthy();
    expect(typeof toUnix).toBe("number");

    expect(unix).toBe(toUnix);
    expect(unix).toBe(Math.floor(currentNow / 1000));
    expect(unix).not.toBe(currentTime);
    expect(unix).not.toBe(currentNow);
    expect(unix).not.toBe(fromUnix);

    expect(fromUnix).toEqual(currentTime);
    expect(fromUnix.getTime()).toBe(currentNow);
    expect(unix).toBe(DateLib.toUnix(currentTime));
  });

  test("addMonths, addDays, addHours, addMinutes, addSeconds, addMilliseconds", () => {
    const date = new Date();
    date.setUTCFullYear(2022);
    date.setUTCMonth(0);
    date.setUTCDate(1);
    date.setUTCHours(1);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    const addedMonth = DateLib.addMonths(date, 3);
    const addedDays = DateLib.addDays(date, 3);
    const addedYear = DateLib.addMonths(date, 12);
    const addedHours = DateLib.addHours(date, 3);
    const addedMinutes = DateLib.addMinutes(date, 3);
    const addedSeconds = DateLib.addSeconds(date, 3);
    const addedMilliseconds = DateLib.addMilliseconds(date, 3);

    // month start from 0
    // 0 = january
    const newYear = addedYear.getUTCFullYear();
    expect(year).not.toEqual(newYear);
    expect(2023).toEqual(newYear);

    const newMonth = addedMonth.getUTCMonth();
    expect(month).not.toEqual(newMonth);
    expect(3).toEqual(newMonth);

    const newDay = addedDays.getUTCDate();
    expect(day).not.toEqual(newDay);
    expect(4).toEqual(newDay);

    const newHour = addedHours.getUTCHours();
    expect(hour).not.toEqual(newHour);
    expect(4).toEqual(newHour);

    const newMinutes = addedMinutes.getUTCMinutes();
    expect(minutes).not.toEqual(newMinutes);
    expect(3).toEqual(newMinutes);

    const newSeconds = addedSeconds.getUTCSeconds();
    expect(seconds).not.toEqual(newSeconds);
    expect(3).toEqual(newSeconds);

    const newMs = addedMilliseconds.getUTCMilliseconds();
    expect(milliseconds).not.toEqual(newMs);
    expect(3).toEqual(newMs);
  });

  test("getSomInUTC or Start of the Month", () => {
    const currentDate = new Date();
    const result = DateLib.getSomInUTC(currentDate);

    expect(result.getUTCFullYear()).toEqual(currentDate.getUTCFullYear());
    expect(result.getUTCMonth()).toEqual(currentDate.getUTCMonth());
    expect(result.getUTCDate()).toEqual(1);
    expect(result.getUTCHours()).toEqual(0);
    expect(result.getUTCMinutes()).toEqual(0);
    expect(result.getUTCSeconds()).toEqual(0);
    expect(result.getUTCMilliseconds()).toEqual(0);

    expect(DateLib.getSomInUTC("null").toDateString()).toBe("Invalid Date");
  });

  test("getEomInUTC or End of the Month", () => {
    const currentDate = new Date();
    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    currentDate.setUTCDate(0);

    const result = DateLib.getEomInUTC(currentDate);

    expect(result.getUTCFullYear()).toEqual(currentDate.getUTCFullYear());
    expect(result.getUTCMonth()).toEqual(currentDate.getUTCMonth());
    expect(result.getUTCDate()).toEqual(currentDate.getUTCDate());
    expect(result.getUTCHours()).toEqual(23);
    expect(result.getUTCMinutes()).toEqual(59);
    expect(result.getUTCSeconds()).toEqual(59);

    expect(DateLib.getEomInUTC("null").toDateString()).toBe("Invalid Date");
  });

  test("toDateFormat", () => {
    const date = new Date();
    date.setUTCFullYear(2022);
    date.setUTCMonth(0);
    date.setUTCDate(1);
    date.setUTCHours(1);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    expect(
      DateLib.toDateFormat(
        date,
        "en",
        { month: "short", day: "numeric" },
        "UTC"
      )
    ).toBe("Jan 1");

    expect(
      DateLib.toDateFormat(
        date,
        "en",
        { month: "short", day: "numeric", year: "numeric" },
        "UTC"
      )
    ).toBe("Jan 1, 2022");

    expect(
      DateLib.toDateFormat(
        date,
        "en",
        { month: "short", day: "numeric", year: "numeric", hour: "numeric" },
        "UTC"
      )
    ).toBe("Jan 1, 2022, 1 AM");

    expect(
      DateLib.toDateFormat(
        date,
        "en",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        },
        "UTC"
      )
    ).toBe("Jan 1, 2022, 1:00 AM");

    expect(
      DateLib.toDateFormat(
        date,
        "en",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        },
        "UTC"
      )
    ).toBe("Jan 1, 2022, 1:00:00 AM");

    expect(
      DateLib.toDateFormat("0", "en", { month: "short", day: "numeric" }, "UTC")
    ).toBe("Not Available");

    expect(DateLib.toDateFormat(date.getTime() / 1000, "en")).toBe("1/1/2022");

    expect(DateLib.toDateFormat(date.getTime() / 1000)).toBe("1/1/2022");
  });

  test("toLongDateFormat", () => {
    const date = new Date();
    date.setUTCFullYear(2022);
    date.setUTCMonth(0);
    date.setUTCDate(1);
    date.setUTCHours(1);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    expect(
      DateLib.toLongDateFormat(date, "en", "UTC", {
        month: "short",
        day: "numeric",
      })
    ).toBe("Jan 1");

    expect(
      DateLib.toLongDateFormat(date, "en", "UTC", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    ).toBe("Jan 1, 2022");

    expect(
      DateLib.toLongDateFormat(date, "en", "UTC", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
      })
    ).toBe("Jan 1, 2022, 1 AM");

    expect(
      DateLib.toLongDateFormat(date, "en", "UTC", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    ).toBe("Jan 1, 2022, 1:00 AM");

    expect(
      DateLib.toLongDateFormat(date, "en", "UTC", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    ).toBe("Jan 1, 2022, 1:00:00 AM");

    expect(
      DateLib.toLongDateFormat("0", "en", "UTC", {
        month: "short",
        day: "numeric",
      })
    ).toBe("Not Available");

    // hard to test since this throws your locations time with gmt
    expect(DateLib.toLongDateFormat(date.getTime() / 1000, "en")).toContain(
      "Jan 1, 2022"
    );
  });

  test("toDateTimeLocal", () => {
    const date = new Date();
    date.setUTCFullYear(2022);
    date.setUTCMonth(0);
    date.setUTCDate(1);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);

    const currentDate = new Date();

    currentDate.setUTCDate(date.getDate());
    currentDate.setUTCFullYear(date.getFullYear());
    currentDate.setUTCHours(date.getHours());
    currentDate.setUTCMilliseconds(date.getMilliseconds());
    currentDate.setUTCMinutes(date.getMinutes());
    currentDate.setUTCMonth(date.getMonth());
    currentDate.setUTCSeconds(date.getSeconds());

    const expectedResult = currentDate.toISOString().slice(0, 16);

    expect(
      DateLib.toDateTimeLocal(new Date(DateLib.toUnix(date) * 1000))
    ).toEqual(expectedResult);

    expect(DateLib.toDateTimeLocal(DateLib.toUnix(date))).toEqual(
      expectedResult
    );
  });

  test("toDateTimeLocal default", () => {
    const currentDate = new Date();

    currentDate.setUTCDate(currentDate.getDate());
    currentDate.setUTCFullYear(currentDate.getFullYear());
    currentDate.setUTCHours(currentDate.getHours());
    currentDate.setUTCMilliseconds(currentDate.getMilliseconds());
    currentDate.setUTCMinutes(currentDate.getMinutes());
    currentDate.setUTCMonth(currentDate.getMonth());
    currentDate.setUTCSeconds(currentDate.getSeconds());

    const expectedResult = currentDate.toISOString().slice(0, 16);

    expect(DateLib.toDateTimeLocal()).toEqual(expectedResult);
  });
});
