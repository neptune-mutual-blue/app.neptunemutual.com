import { getLocale } from "@/utils/locale";

class DateLib {
  static unix() {
    return Math.floor(Date.now() / 1000);
  }

  static fromUnix(unixTimestamp) {
    return new Date(unixTimestamp * 1000);
  }

  static toUnix(date) {
    return Math.floor(date.getTime() / 1000);
  }

  static addMonths(date, months) {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + parseInt(months));
    return result;
  }

  // Start of month
  static getSomInUTC(date) {
    const result = new Date(date);

    result.setUTCDate(1);
    result.setUTCHours(0);
    result.setUTCMinutes(0);
    result.setUTCSeconds(0);
    result.setUTCMilliseconds(0);

    return result;
  }

  static getEomInUTC(date) {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + 1);

    result.setUTCDate(0);

    result.setUTCHours(23);
    result.setUTCMinutes(59);
    result.setUTCSeconds(59);

    return result;
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + parseInt(days));
    return result;
  }

  static addHours(date, hours) {
    return DateLib.addMinutes(date, parseInt(hours) * 60);
  }

  static addMinutes(date, minute) {
    return DateLib.addSeconds(date, parseInt(minute) * 60);
  }

  static addSeconds(date, seconds) {
    return DateLib.addMilliseconds(date, parseInt(seconds) * 1000);
  }

  static addMilliseconds(date, milliseconds) {
    return new Date(date.getTime() + parseInt(milliseconds));
  }

  static toDateFormat(date, options, preferTimezone) {
    if (!(date instanceof Date)) {
      date = DateLib.fromUnix(date);
    }

    if (preferTimezone) {
      options.timeZone = preferTimezone;
    }

    return new Intl.DateTimeFormat(getLocale(), options).format(date);
  }

  static toLongDateFormat(date, preferTimezone) {
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
  }
}

export default DateLib;
