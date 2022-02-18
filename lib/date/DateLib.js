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

  static addMonths(timeStamp, months) {
    const result = new Date(timeStamp);
    return result.setUTCMonth(result.getUTCMonth() + months);
  }

  static endOfMonth(timeStamp) {
    const result = new Date(timeStamp);
    result.setUTCMonth(result.getUTCMonth() + 1);
    return result.setUTCDate(0);
  }

  static endOfDay(timeStamp) {
    const result = new Date(timeStamp);
    return result.setHours(23, 59, 59, 0);
  }

  static addDays(timeStamp, days) {
    const result = new Date(timeStamp);
    return result.setUTCDate(result.getUTCDate() + days);
  }

  static addHours(timeStamp, hours) {
    return DateLib.addMinutes(timeStamp, hours * 60);
  }

  static addMinutes(timeStamp, minute) {
    return DateLib.addSeconds(timeStamp, minute * 60);
  }

  static addSeconds(timeStamp, seconds) {
    return DateLib.addMilliseconds(timeStamp, seconds * 1000);
  }

  static addMilliseconds(timeStamp, milliseconds) {
    return new Date(timeStamp + milliseconds).getTime();
  }
}

export default DateLib;
