export const getTokenImgSrc = (tokenSymbol = "") => {
  try {
    if (!tokenSymbol) {
      throw Error("invalid token symbol");
    }

    return `/images/tokens/${tokenSymbol.toLowerCase()}.png`;
  } catch (error) {
    return `/images/covers/empty.png`;
  }
};
