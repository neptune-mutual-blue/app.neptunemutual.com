export const truncateAddress = (addr) => {
  return addr.substring(0, 4) + '....' + addr.slice(-4)
}

export const truncateAddressParam = (addr, front = 4, end = -4) => { return addr.slice(0, front) + '...' + addr.slice(end) }
