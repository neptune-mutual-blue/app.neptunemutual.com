class DateLib {
  static unix () {
    return Math.floor(Date.now() / 1000)
  }

  static fromUnix (unixTimestamp) {
    return new Date(unixTimestamp * 1000)
  }

  static toUnix (date) {
    return Math.floor(date.getTime() / 1000)
  }

  // Start of month
  static getSomInUTC (date) {
    const result = new Date(date)

    result.setUTCDate(1)
    result.setUTCHours(0)
    result.setUTCMinutes(0)
    result.setUTCSeconds(0)
    result.setUTCMilliseconds(0)

    return result
  }

  static getEomInUTC (date) {
    const result = new Date(date)
    result.setUTCMonth(result.getUTCMonth() + 1)

    result.setUTCDate(0)

    result.setUTCHours(23)
    result.setUTCMinutes(59)
    result.setUTCSeconds(59)

    return result
  }

  static getEodInUTC (date) {
    const result = new Date(date)
    result.setUTCDate(result.getUTCDate() + 1)

    result.setUTCHours(23)
    result.setUTCMinutes(59)
    result.setUTCSeconds(59)

    return result
  }

  static addMonths (date, months) {
    const result = new Date(date)
    result.setUTCMonth(result.getUTCMonth() + parseInt(months))

    return result
  }

  static addDays (date, days) {
    const result = new Date(date)
    result.setUTCDate(result.getUTCDate() + parseInt(days))

    return result
  }

  static addHours (date, hours) {
    return DateLib.addMinutes(date, parseInt(hours) * 60)
  }

  static addMinutes (date, minute) {
    return DateLib.addSeconds(date, parseInt(minute) * 60)
  }

  static addSeconds (date, seconds) {
    return DateLib.addMilliseconds(date, parseInt(seconds) * 1000)
  }

  static addMilliseconds (date, milliseconds) {
    return new Date(date.getTime() + parseInt(milliseconds))
  }

  static toDateFormat (date, locale = 'en', options, preferTimezone) {
    if (parseInt(date) === 0) {
      return 'Not Available'
    }

    if (!(date instanceof Date)) {
      date = DateLib.fromUnix(date)
    }

    if (date.getTime() === 0) {
      return 'Not Available'
    }

    if (preferTimezone) {
      options.timeZone = preferTimezone
    }

    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  /**
   *
   * @param {string | number | Date} date
   * @param {string} [locale]
   * @param {string} [preferTimezone]
   * @param {Object.<string, string>} [options]
   * @returns
   */
  static toLongDateFormat (
    date,
    locale,
    preferTimezone,
    options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
      timeZoneName: 'short'
    }
  ) {
    if (
      (typeof date === 'number' || typeof date === 'string') &&
      (parseInt(date.toString()) === 0)
    ) {
      return 'Not Available'
    }

    if (!(date instanceof Date)) {
      date = DateLib.fromUnix(date)
    }

    if (preferTimezone) {
      options.timeZone = preferTimezone
    }

    return DateLib.toDateFormat(date, locale, options, preferTimezone)
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#local_date_and_time_strings
   * @param {Date | number} [date]
   * @returns {string}
   */
  static toDateTimeLocal (date = new Date()) {
    if (!(date instanceof Date)) {
      date = DateLib.fromUnix(date)
    }

    const result = new Date()
    result.setUTCDate(date.getDate())
    result.setUTCFullYear(date.getFullYear())
    result.setUTCHours(date.getHours())
    result.setUTCMilliseconds(date.getMilliseconds())
    result.setUTCMinutes(date.getMinutes())
    result.setUTCMonth(date.getMonth())
    result.setUTCSeconds(date.getSeconds())

    // Format: YYYY-MM-DDThh:mm
    return result.toISOString().slice(0, 16)
  }
}

export default DateLib
