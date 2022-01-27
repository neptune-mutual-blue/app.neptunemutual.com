export const truncateAddress = (addr) => {
  return addr.substring(0, 4) + "...." + addr.slice(-4);
};
