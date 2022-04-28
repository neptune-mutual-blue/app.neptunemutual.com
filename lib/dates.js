export const getMonthNames = (locale) => {
  const baseDate = new Date(Date.UTC(2017, 0, 1)); // just a Monday
  const weekDays = [];

  for (let i = 0; i < 12; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { month: "long" }));
    baseDate.setMonth(baseDate.getMonth() + 1);
  }

  return weekDays;
}
