import { useRouter } from "next/router";

export const useDateFormat = () => {
  const router = useRouter();

  const getMonthNames = () => {
    const baseDate = new Date(Date.UTC(2017, 0, 1)); // just a Monday
    const weekDays = [];

    for (let i = 0; i < 12; i++) {
      weekDays.push(
        baseDate.toLocaleDateString(router.locale, { month: "long" })
      );
      baseDate.setMonth(baseDate.getMonth() + 1);
    }

    return weekDays;
  };

  const DateLibFormat = () => {
    this.unix = () => {
      return Math.floor(Date.now() / 1000);
    };

    this.fromUnix = (unixTimestamp) => {
      return new Date(unixTimestamp * 1000);
    };

    this.toUnix = (date) => {
      return Math.floor(date.getTime() / 1000);
    };

    this.addMonths = (date, months) => {
      const result = new Date(date);
      result.setUTCMonth(result.getUTCMonth() + parseInt(months));
      return result;
    };

    // Start of month
    this.getSomInUTC = (date) => {
      const result = new Date(date);

      result.setUTCDate(1);
      result.setUTCHours(0);
      result.setUTCMinutes(0);
      result.setUTCSeconds(0);
      result.setUTCMilliseconds(0);

      return result;
    };

    this.getEomInUTC = (date) => {
      const result = new Date(date);
      result.setUTCMonth(result.getUTCMonth() + 1);

      result.setUTCDate(0);

      result.setUTCHours(23);
      result.setUTCMinutes(59);
      result.setUTCSeconds(59);

      return result;
    };

    this.addDays = (date, days) => {
      const result = new Date(date);
      result.setUTCDate(result.getUTCDate() + parseInt(days));
      return result;
    };

    this.addHours = (date, hours) => {
      return DateLib.addMinutes(date, parseInt(hours) * 60);
    };

    this.addMinutes = (date, minute) => {
      return DateLib.addSeconds(date, parseInt(minute) * 60);
    };

    this.addSeconds = (date, seconds) => {
      return DateLib.addMilliseconds(date, parseInt(seconds) * 1000);
    };

    this.addMilliseconds = (date, milliseconds) => {
      return new Date(date.getTime() + parseInt(milliseconds));
    };

    this.toDateFormat = (date, options, preferTimezone) => {
      if (parseInt(date) === 0) {
        return "Not Available";
      }

      if (!(date instanceof Date)) {
        date = DateLib.fromUnix(date);
      }

      if (preferTimezone) {
        options.timeZone = preferTimezone;
      }

      return new Intl.DateTimeFormat(getLocale(), options).format(date);
    };

    this.toLongDateFormat = (date, preferTimezone) => {
      if (parseInt(date) === 0) {
        return "Not Available";
      }

      if (!(date instanceof Date)) {
        date = DateLib.fromUnix(date);
      }

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      };

      if (preferTimezone) {
        options.timeZone = preferTimezone;
      }

      return DateLib.toDateFormat(date, options, preferTimezone);
    };
  };

  return {
    getMonthNames,
    DateLibFormat,
  };
};
