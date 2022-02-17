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
    return result.setUTCMonth(result.getUTCMonth() + months);
  }

  static endOfMonth(date) {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + 1);
    return result.setUTCDate(0);
  }

  static endOfDay(date) {
    const result = new Date(date);
    return result.setHours(23, 59, 59, 0);
  }

  static addDays(date, days) {
    const result = new Date(date);
    return result.setUTCDate(result.getUTCDate() + days);
  }

  static addHours(date, hours) {
    return DateLib.addMinutes(date, hours * 60);
  }

  static addMinutes(date, minute) {
    return DateLib.addSeconds(date, minute * 60);
  }

  static addSeconds(date, seconds) {
    return DateLib.addMilliseconds(date, seconds * 1000);
  }

  static addMilliseconds(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
  }
}

export default DateLib;
