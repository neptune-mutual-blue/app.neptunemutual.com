import { convertFromUnits, toBNSafe } from '@/utils/bn'

const getSumInDollars = ({ rates, amounts }) => {
  const sum = amounts.reduce((acc, curr) => {
    const amount = curr.value
    const rate = rates[curr.token] ? convertFromUnits(rates[curr.token], curr.decimals) : 1
    const _acc = acc.plus(toBNSafe(amount).multipliedBy(rate))

    return _acc
  }, toBNSafe(0))

  return sum
}

export { getSumInDollars }
