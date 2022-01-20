import BigNumber from "bignumber.js";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const hasValue = (x) => {
  return !(!x || !parseFloat(x.toString()));
};

export const isValidNumber = (x) => {
  if (BigNumber.isBigNumber(x)) {
    return true;
  }

  if (isNaN(x)) {
    return false;
  }

  const y = new BigNumber(x);
  return BigNumber.isBigNumber(y);
};

export const convertFromUnits = (value, decimals = 18) => {
  return BigNumber(value.toString()).dividedBy(Math.pow(10, decimals));
};

export const convertToUnits = (value, decimals = 18) => {
  return BigNumber(value.toString())
    .multipliedBy(Math.pow(10, decimals))
    .decimalPlaces(0);
};

export const ether = (value) => {
  const wei = BigNumber(value.toString())
    .multipliedBy(Math.pow(10, 18))
    .decimalPlaces(0);
  return wei;
};

export const toWei = (x) => ether(x);

// export const toEther = (value) => {
//   const wei = BigNumber(value.toString()).dividedBy(Math.pow(10, 18))
//   return wei.toNumber()
// }

// export const fromWei = (x) => toEther(x)

// --- Utils ---

export const calcPercent = (a, b) => {
  let divisor = b;

  if (!hasValue(divisor)) {
    divisor = 1;
  }

  return BigNumber(a.toString())
    .multipliedBy(100)
    .dividedBy(divisor.toString());
};

export const amountsToPercentages = (...amounts) => {
  let total = BigNumber.sum.apply(
    null,
    amounts.map((x) => x.toString())
  );

  if (!hasValue(total)) {
    total = 1;
  }

  return amounts.map((x) =>
    new BigNumber(x.toString()).multipliedBy(100).dividedBy(total).toNumber()
  );
};

export const calculateGasMargin = (value) => {
  return new BigNumber(value.toString())
    .multipliedBy(1.3)
    .decimalPlaces(0)
    .toString();
};

export const sumOf = (...amounts) => {
  let sum = new BigNumber("0");

  amounts.forEach((amount) => {
    if (!amount || amount.toString() === "NaN" || !hasValue(amount)) return;

    try {
      sum = sum.plus(amount.toString());
    } catch (error) {
      console.log("could not add", amount);
    }
  });

  return sum;
};

export const differenceOf = (a, b) => {
  return new BigNumber(a.toString()).minus(b.toString());
};

export const sort = (amounts, selector, reverse = false) => {
  return [...amounts].sort((a, b) => {
    const numA = selector ? selector(a) : a;
    const bigA = new BigNumber(numA.toString());

    const numB = selector ? selector(b) : b;
    const bigB = new BigNumber(numB.toString());

    if (bigA.isLessThan(bigB)) {
      return reverse ? 1 : -1;
    }
    if (bigA.isGreaterThan(bigB)) {
      return reverse ? -1 : 1;
    }
    // a must be equal to b
    return 0;
  });
};

export const isGreater = (a, b) => {
  try {
    const bigA = new BigNumber(a.toString());
    const bigB = new BigNumber(b.toString());

    return bigA.isGreaterThan(bigB);
  } catch (error) {
    console.error(error);
  }

  return false;
};

export const isGreaterOrEqual = (a, b) => {
  try {
    const bigA = new BigNumber(a.toString());
    const bigB = new BigNumber(b.toString());

    return bigA.isGreaterThanOrEqualTo(bigB);
  } catch (error) {
    console.error(error);
  }

  return false;
};

export const maxIn = (arr) => {
  return arr
    .filter((x) => x && hasValue(x))
    .reduce((acc, val) => {
      acc = new BigNumber(val).isGreaterThan(acc) ? val : acc;
      return acc;
    }, "0");
};

export const getRelativePercent = (min, max, now) => {
  const a = new BigNumber(now.toString())
    .minus(min.toString())
    .multipliedBy(100);
  const b = new BigNumber(max.toString()).minus(min.toString());

  return a.dividedBy(b).decimalPlaces(2, BigNumber.ROUND_DOWN).toNumber();
};
