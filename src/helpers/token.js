export const getTokenImgSrc = (tokenSymbol = "") => {
  try {
    return `/images/tokens/${tokenSymbol.toUpperCase()}.png`;
  } catch (error) {
    return `/images/tokens/OKB.png`;
  }
};
