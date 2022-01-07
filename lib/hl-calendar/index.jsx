// HlCalendar - Highlight Calendar
export const HlCalendar = ({ startDate, endDate }) => {
  const { month, year } = getPrimaryMonthYear(startDate, endDate);
  const allDates = addWeekDatesAfter(
    addWeekDatesBefore(getMonth(month, year, startDate))
  );

  const arr = chunk(allDates, 7);
  const weekDays = getWeekDays("en-US");

  return (
    <table className="text-xxs" aria-hidden="true">
      <thead>
        <tr>
          {weekDays.map((x) => (
            <td
              key={x}
              className="p-3 text-center align-middle lowercase font-medium"
            >
              {x[0]}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {arr.map((x, _i) => (
          <tr key={_i}>
            {x.map((y, _j) => {
              const isStart = startDate.getTime() == y.getTime();
              const isEnd = endDate.getTime() == y.getTime();
              const isInsideRange =
                startDate.getTime() <= y.getTime() &&
                endDate.getTime() >= y.getTime();
              const isDifferentMonth = month !== y.getMonth();

              return (
                <td
                  key={_j}
                  className={classNames(
                    "p-3 text-center align-middle",
                    isStart && "rounded-l-lg",
                    isEnd && "rounded-r-lg",
                    isInsideRange && "bg-DEEAF6",
                    isDifferentMonth && "opacity-40"
                  )}
                >
                  {y.getDate()}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function addWeekDatesBefore(dates) {
  const datesBeforeStart = [...dates];

  function shouldContinue(firstDate) {
    // Sunday - Saturday : 0 - 6
    return firstDate.getDay() > 0;
  }

  function getPreviousDate(date) {
    const copiedDate = getClone(date);
    copiedDate.setDate(date.getDate() - 1);
    return copiedDate;
  }

  while (shouldContinue(datesBeforeStart[0])) {
    const previousDate = getPreviousDate(datesBeforeStart[0]);
    datesBeforeStart.unshift(previousDate);
  }

  return datesBeforeStart;
}

function addWeekDatesAfter(dates) {
  const datesAfterEnd = [...dates];

  function shouldContinue(lastDate) {
    // Sunday - Saturday : 0 - 6
    return lastDate.getDay() < 6;
  }

  function getNextDate(date) {
    const copiedDate = getClone(date);
    copiedDate.setDate(date.getDate() + 1);
    return copiedDate;
  }

  while (shouldContinue(datesAfterEnd[datesAfterEnd.length - 1])) {
    const nextDate = getNextDate(datesAfterEnd[datesAfterEnd.length - 1]);
    datesAfterEnd.push(nextDate);
  }

  return datesAfterEnd;
}

function getPrimaryMonthYear(startDate, endDate) {
  const startMonth = startDate.getMonth(); // January - December : 0 - 11
  const endMonth = endDate.getMonth(); // January - December : 0 - 11

  if (startMonth !== endMonth) {
    return startMonth;
  }

  const daysOfMonth = {
    [startMonth]: 0,
    [endMonth]: 1,
  };

  const cursorDate = getClone(startDate);
  while (cursorDate.getDate() !== endDate.getDate()) {
    daysOfMonth[cursorDate.getMonth()] += 1;

    cursorDate.setDate(cursorDate.getDate() + 1);
  }

  return {
    month:
      daysOfMonth[startMonth] > daysOfMonth[endDate] ? startMonth : endMonth,

    year:
      daysOfMonth[startMonth] > daysOfMonth[endDate]
        ? startDate.getFullYear()
        : endDate.getFullYear(),
  };
}

function getClone(date) {
  return new Date(date.getTime());
}

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getMonth(month, year, refDate) {
  // Using refDate to match the time and timezone, and only modifying the date,month,year
  const date = getClone(refDate);
  date.setFullYear(year);
  date.setMonth(month);
  date.setDate(1);

  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function chunk(arrayToSplit = [], chunkSize = 10) {
  const chunks = [];

  for (let i = 0; i < arrayToSplit.length; i += chunkSize) {
    const tempArray = arrayToSplit.slice(i, i + chunkSize);
    chunks.push(tempArray);
  }

  return chunks;
}

function getWeekDays(locale) {
  const baseDate = new Date(Date.UTC(2017, 0, 1)); // just a Monday
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: "long" }));
    baseDate.setDate(baseDate.getDate() + 1);
  }

  return weekDays;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
