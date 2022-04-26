import { toWei } from "@/utils/bn";

export const getTokenImgSrc = (tokenSymbol = "") => {
  try {
    if (!tokenSymbol) {
      throw Error("invalid token symbol");
    }

    return `/images/tokens/${tokenSymbol.toLowerCase()}.svg`;
  } catch (error) {
    return `/images/covers/empty.svg`;
  }
};

export const getNpmPayload = (address) => {
  return [
    {
      id: address,
      data: [
        {
          type: "token",
          address: address,
          amount: toWei(1).toString(),
        },
      ],
    },
  ];
};
