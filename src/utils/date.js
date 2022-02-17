import DateLib from "@/lib/date/DateLib";

const options = {
  weekday: "long", // "narrow", "short", "long"
  year: "numeric", // "numeric", "2-digit"
  month: "long", // "numeric", "2-digit", "narrow", "short", "long"
  day: "numeric", // "numeric", "2-digit"
  hour: "numeric", // "numeric", "2-digit"
  minute: "numeric", // "numeric", "2-digit"
  second: "2-digit", // "numeric", "2-digit"
  // era: "short", // short, narrow
  hour12: true,
};

export const formatDate = (unixTimestamp, formatString) => {
  let fmt = formatString;
  let tokenArray = [...fmt.matchAll(/[A-Z|a-z]+/g)];
  tokenArray = tokenArray.reduce((prev, curr) => {
    prev.push(curr[0]);
    return prev;
  }, []);
  let opts = options;
  const tokenObject = {};

  tokenArray.map((token) => {
    switch (token) {
      case "YY":
        opts.year = "2-digit";
        tokenObject[token] = "year";
        break;
      case "YYYY":
        opts.year = "numeric";
        tokenObject[token] = "year";
        break;
      case "M":
        opts.month = "numeric";
        tokenObject[token] = "month";
        break;
      case "MM":
        opts.month = "2-digit";
        tokenObject[token] = "month";
        break;
      case "MMM":
        opts.month = "short";
        tokenObject[token] = "month";
        break;
      case "MMMM":
        opts.month = "long";
        tokenObject[token] = "month";
        break;
      case "D":
        opts.day = "numeric";
        tokenObject[token] = "day";
        break;
      case "DD":
        opts.day = "2-digit";
        tokenObject[token] = "day";
        break;
      case "ddd":
        opts.weekday = "short";
        tokenObject[token] = "weekday";
        break;
      case "dddd":
        opts.weekday = "long";
        tokenObject[token] = "weekday";
        break;
      case "h":
        opts.hour = "numeric";
        tokenObject[token] = "hour";
        break;
      case "hh":
        opts.hour = "2-digit";
        tokenObject[token] = "hour";
        break;
      case "H":
        opts.hour12 = false;
        opts.hour = "numeric";
        tokenObject[token] = "hour";
        break;
      case "HH":
        opts.hour12 = false;
        opts.hour = "2-digit";
        tokenObject[token] = "hour";
        break;
      case "m":
        opts.minute = "numeric";
        tokenObject[token] = "minute";
        break;
      case "mm":
        opts.minute = "2-digit";
        tokenObject[token] = "minute";
        break;
      case "s":
        opts.second = "numeric";
        tokenObject[token] = "second";
        break;
      case "ss":
        opts.second = "2-digit";
        tokenObject[token] = "second";
        break;
      case "a":
        tokenObject[token] = "ampm";
        break;
      case "A":
        tokenObject[token] = "ampm";
        break;
      default:
        break;
    }
  });

  const dateString = new Date(unixTimestamp * 1000).toLocaleDateString(
    "en-EN",
    opts
  );
  const dateObject = {};

  const dsArray = dateString.split(", ");
  dateObject["weekday"] = dsArray[0];
  let timeString = dsArray[dsArray.length - 1];
  if (opts.hour12) {
    dateObject["ampm"] = tokenArray.includes("a")
      ? timeString.split(" ")[1].toLowerCase()
      : timeString.split(" ")[1];
    timeString = timeString.split(" ")[0];
  }
  const tsArray = timeString.split(":");
  dateObject["hour"] = tsArray[0];
  dateObject["minute"] = tsArray[1];
  dateObject["second"] = tsArray[2];

  if (opts.month === "numeric" || opts.month === "2-digit") {
    const dateArray = dsArray[1].split("/");
    dateObject["month"] = dateArray[0];
    dateObject["day"] = dateArray[1];
    dateObject["year"] = dateArray[2];
  } else {
    dateObject["year"] = dsArray[2];

    dateObject["month"] = dsArray[1].split(" ")[0];
    dateObject["day"] = dsArray[1].split(" ")[1];
  }

  tokenArray.map((token) => {
    const tokenVal = dateObject[tokenObject[token]];
    fmt = fmt.replace(token, tokenVal);
  });
  return fmt;
};

export function unixToDate(unix, format = "YYYY-MM-DD") {
  return formatDate(parseInt(unix), format);
}

export const formatTime = (unix) => {
  const now = DateLib.unix();
  const timestamp = parseInt(unix);
  const inSeconds = Math.abs(now - timestamp);
  const inMinutes = Math.floor(inSeconds / 60);
  const inHours = Math.floor(inSeconds / 60 / 60);
  const inDays = Math.floor(inSeconds / 60 / 60 / 24);

  if (inMinutes < 1) {
    return "recently";
  }

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? "day" : "days"} ago`;
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? "hour" : "hours"} ago`;
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${inSeconds} ${inSeconds === 1 ? "second" : "seconds"} ago`;
  }
};
