export const getTokenImgSrc = (tokenSymbol = "") => {
  try {
    if (!tokenSymbol) {
      throw Error("invalid token symbol");
    }

    return `/images/tokens/${tokenSymbol.toUpperCase()}.png`;
  } catch (error) {
    return `/images/tokens/OKB.png`;
  }
};
